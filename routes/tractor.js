var Backbone = require('backbone'), 
	_ = require('underscore')._,
	Card = require('./card.js').Card, 
	util = require('util');

var Player = Backbone.Model.extend({
	initialize: function(name){
		this.name = name;
		this.cards = Card.cards();
	}, 
	hasCards: function(cards){
		_.each(cards, function(card){
			if(!this.cards.contains(card)){
				return false;
			}
		});
		return true;
	}, 
	deal: function(card){
		this.cards.add(card);
	}, 
	equals: function(another){
		return this.name == another.name;
	}, 
	canFlip: function(){
		return this.cards.canFlip();
	}
});
var Pair = Backbone.Model.extend({
	initialize: function(name, seat0, seat1){
		this.name = name;
		this.seats = new Backbone.Collection();
		this.seats.add(seat0);
		this.seats.add(seat1);
		this.isDefenders = false;
		this.isAttackers = false;
	}, 
	hasPlayer: function(player){
		return this.seats.any(function(seat){
			return seat.player.equals(player);
		});
	}, 
	setDefender: function(isDefenders){
		this.isDefenders = isDefenders;
		this.isAttackers = !isDefenders;
	}, 
	rank: function(){
		return this.seats.at(0).rank;
	}
});
var Seat = Backbone.Model.extend({
	initialize: function(){
		this.rank = Card.Ranks.TWO;
	},	
	join: function(player){
		if(this.isTaken()){
			throw "Cannot take seat";
		}
		this.player = player;
	}, 
	isTaken: function(){
		return typeof(this.player) == 'object';
	}
});
var Seats = Backbone.Model.extend({
	model: Seat,
	initialize: function(seat0, seat1, seat2, seat3){
		this.seats = new Backbone.Collection();
		this.seats.add(seat0);
		this.seats.add(seat1);
		this.seats.add(seat2);
		this.seats.add(seat3);
		console.log("========" + util.inspect(this.seats));
		this.pairs = new Backbone.Collection();
		this.pairs.add(new Pair("team0", seat0, seat2)); 
		this.pairs.add(new Pair("team1", seat1, seat3));
	},
	full: function(){		
		return this.seats.all(function(seat){
			return seat.isTaken();
		});
	},
	join: function(player, seatIndex){
		if(seatIndex < 0 || seatIndex > 3){
			throw "Cannot take seat";
		}
		if(this.hasPlayer(player)){
			throw "Cannot take seat";
		}
		this.seats.at(seatIndex).join(player, seatIndex);
	}, 
	defenders: function(){
		return this.pairs.find(function(pair){
			if(pair.isDefenders){
				return pair;
			}
		});
	}, 
	attackers: function(){
		return this.pairs.find(function(pair){
			if(pair.isAttackers){
				return pair;
			}
		});
	}, 
	getPlayer: function(seatIndex){
		return this.seats.at(seatIndex).player;
	}, 
	setDefender: function(player){
		this.pairs.each(function(pair){
			pair.setDefender(pair.hasPlayer(player));
		});
	}, 
	hasPlayer: function(player){
		return this.seats.any(function(seat){
			return seat.player != undefined && seat.player.equals(player);
		});
	}, 
	getPair: function(player){
		return this.pairs.find(function(pair){
			return pair.hasPlayer(player);
		});
	}, 
	players: function(){
		return this.seats.map(function(seat){
			return seat.player;
		});
	},
	playersCanFlip: function(){
		return _.find(this.players(), function(player){
			return player != undefined && player.canFlip();
		});
	}, 
	getSeat: function(direction){ 
		var seatIndex;
		switch(direction){
			case 'N':
				seatIndex = 0;
				break;
			case 'W':
				seatIndex = 1;
				break;
			case 'S':
				seatIndex = 2;
				break;
			case 'E':
				seatIndex = 3;
			    break;
		}  
		
		return this.seats.at(seatIndex);
	}
}, {
	prepareSeats: function(){
		return new Seats(new Seat({id:0}), new Seat({id:1}), new Seat({id:2}), new Seat({id:3}));
	}
});
var Flipping = Backbone.Model.extend({
	initialize: function(player, jokers, trumps){
		this.level = this.check(player, jokers, trumps);
		if(this.level < 0){
			this.isValid = false;
		}
		else{
			this.isValid = true;
		}
		if(jokers.size() == 2){
			this.rank = jokers.at(0).rank;
		}
		else if(trumps.size() > 0){
			this.rank = trumps.at(0).rank;
		}
		this.banker = player;
		this.jokers = jokers;
		this.trumps = trumps;
	},
	check: function(player, jokers, trumps){
		if(jokers.size() == 0 || jokers.size > 2 || trumps.size() > 2){
			return -1;
		}
		if(jokers.size() == 1){
			if(trumps.size() == 0){
				return -1;
			}
			if(trumps.size() == 1){
				if(jokers.at(0).isSmallJoker() && trumps.at(0).isBlackSuit() ){
					return -1;
				}
				if(jokers.at(0).isBigJoker() && trumps.at(0).isRedSuit() ){
					return -1;
				}
				return 1;
			}
			if(!trumps.at(0).equals(trumps.at(1))){
				return -1;
			}
			if(jokers.at(0).isSmallJoker() && trumps.at(0).isBlackSuit() ){
				return -1;
			}
			if(jokers.at(0).isBigJoker() && trumps.at(0).isRedSuit() ){
				return -1;
			}
			return 2;
		}
		if(!jokers.at(0).equals(jokers.at(1))){
			return -1;
		}
		if(trumps.size() > 0){
			return -1;
		}
		if(jokers.at(0).isSmallJoker()){
			return 5;
		}
		// 2 jokers are big jokers;
		return 10;
	}, 
	matchRank: function(pair){
		return this.rank == Card.Ranks.SMALL_JOKER || this.rank == Card.Ranks.BIG_JOKER || this.rank == pair.rank();
	}
});
var TractorRound = Backbone.Model.extend({
	initialize: function(cards, dealInterval, seats){
		this.cards = cards;		
		this.state = TractorGame.RoundState.READY;
		this.dealInterval= dealInterval;
		this.seats = seats;
		this.currentBanker = null;
		this.currentRank = null;
	},
	start: function(){
		if(this.state != TractorGame.RoundState.READY){
			throw "This round cannot be started";
		}
		// event.start
		this.state = TractorGame.RoundState.DEALING;
		this.deal();
	},
	deal: function(){
		var i = 0;
		var that = this;
		var cards = this.cards.shuffle();
		var dealSlow = function(){
			var card = cards.shift();
			that.seats.getPlayer(i%4).deal(card);
			//event.deal
			if(i++ < 100){
				setTimeout(dealSlow, that.dealInterval);
			}else{
				// event.dealdone
				that.dealFinish();
			}
		};
		dealSlow();
	}, 
	dealFinish: function(){
		//
		if(this.seats.playersCanFlip().length ==0 ){
			console.log("No player is able to flip, will shuffle and deal again");
			this.deal();
		}
	},
	flip: function(player, jokers, trumps){
		console.log("Player " + player.name +" is fliping.");
		if(!player.hasCards(jokers) || !player.hasCards(trumps) || !jokers.allJokers() || !trumps.allSuits()){
			throw "You cannot flip cards";
		}
		var flipping = new Flipping(player, jokers, trumps);
		if(!flipping.isValid){
			throw "You cannot flip cards";			
		}
		var defenders = this.seats.defenders();
		if(defenders == undefined){
			defenders = this.seats.getPair(player);
			if(!flipping.matchRank(defenders)){
				throw "You cannot flip cards";
			}
		};
		if(this.flipping != undefined &&  flipping.level <= this.flipping.level){
			throw "You cannot overturn cards";	
		}
		// event.flip
		this.flipping = flipping;
		this.seats.setDefender(player);
	}
});

var TractorGame = Backbone.Model.extend({
	initialize: function(dealInterval){
		this.seats = Seats.prepareSeats();
		this.gameState = TractorGame.GameState.WAITING;
		this.cards = Card.decks(2);
		this.dealInterval = 1 || dealInterval;
	},
	join: function(player, seat){
		if(this.gameState != TractorGame.GameState.WAITING){
			throw "Cannot join this game";
		}
		// event.join
		this.seats.join(player, seat);
		if(this.seats.full()){
			// event.ready
			this.gameState = TractorGame.GameState.READY;
			this.nextRound();
		}
	},
	flip: function(player, cards){
		if(this.tractorRound == undefined){
			throw "You cannot flip cards";
		}
		var jokers = Card.cards();
		var suits = Card.cards();
		_.each(cards, function(card){
			if(card.isJoker()){
				jokers.add(card);
			}
			else{
				suits.add(card);
			}
		});
		this.tractorRound.flip(player, jokers, suits);
	}, 
	roundState: function(){
		return this.tractorRound ? this.tractorRound.state: null;
	}, 
	nextRound: function(){
		if(this.tractorRound != null && this.tractorRound.state != TractorGame.RoundState.DONE){
			throw "Cannot play next round";
		}
		
		this.tractorRound = new TractorRound(this.cards, this.dealInterval, this.seats);
	}, 
	// When at least player could flip, but he did not flip, will restart this round.
	noFlipping: function(){
		// event.restart round
		this.nextRound();
	}
}, {
	GameState: {WAITING: {value: 0, name: 'Waiting'}, READY: {value: 0, name: 'Ready'}, PLAYING: {value: 0, name:'Playing'}, DONE: {value: 0, name: 'Done'}}, 
	RoundState: {READY: {value: 1, name:'Ready'}, DEALING: {value: 2, name: 'Dealing'}, PLAYING: {value: 3, name: 'Playing'}, DONE: {value: 4, name: 'Done'}}
});


exports.TractorGame = TractorGame;
exports.Player = Player;
exports.TractorRound = TractorRound;
exports.Flipping = Flipping;
