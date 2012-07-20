var Backbone = require('backbone'), 
	_ = require('underscore')._,
	Card = require('./card.js').Card;

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
	}
});
var Pair = Backbone.Model.extend({
	initialize: function(name){
		this.name = name;
		this.players = [];
		this.rank = Card.Ranks.TWO;
	}, 
	join: function(player, seat){
		var index = seat < 2 ? 0 : 1;
		if(typeof(this.players[index]) != undefined){
			throw "Cannot take seat";
		}
		this.players[index] = player;
	}, 
	size: function(){
		return this.players.length;
	}, 
	getPlayerBySeat: function(seat){
		var index = seat < 2 ? 0 : 1;
		return typeof(this.players[index]) == undefined;
	}
});
var Seat = Backbone.Model.extend({
	initialize: function(index){
		this.index = index;
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
var Seats = Backbone.Collection.extend({
	initialize: function(){
		this.
	},
	full: function(){		
		return this.all(function(seat){
			return seat.isTaken();
		});
	},
	join: function(player, seatIndex){
		if(seatIndex < 0 || seatIndex > 3){
			throw "Canont take seat";
		}
		this.at(seatIndex).join(player, seatIndex);
	}, 
	defenders: function(){
		return undefined;
	}
}, {
	prepareSeats: function(){
		var seats = new Seats(); 
		seats.add(new Seat(0));
		seats.add(new Seat(1));
		seats.add(new Seat(2));
		seats.add(new Seat(3));
		return seats;
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
		this.banker = player;
		this.jokers = jokers;
		this.trumps = trumps;
	},
	isValid: function(player, jokers, trumps){
		return this.check(player, jokers, trumps) > 0;
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
		var dealSlow = function(){
			var card = that.cards.shift();
			that.seats.at(i%4).player.deal(card);
			//event.deal
			if(i++ < 100){
				setTimeout(dealSlow, that.dealInterval);
			};
		};
		dealSlow();
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
		if(typeof(this.flipping) != null &&  flipping.level <= this.flipping.level){
			throw "You cannot overturn cards";	
		}
		// event.flip
		this.flipping = flipping;
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
	roundState: function(){
		return this.tractorRound ? this.tractorRound.state: null;
	}, 
	nextRound: function(){
		if(this.tractorRound != null && this.tractorRound.state != TractorGame.RoundState.DONE){
			throw "Cannot play next round";
		}
		
		this.tractorRound = new TractorRound(this.cards, this.dealInterval, this.seats);
	}
}, {
	GameState: {WAITING: {value: 0, name: 'Waiting'}, READY: {value: 0, name: 'Ready'}, PLAYING: {value: 0, name:'Playing'}, DONE: {value: 0, name: 'Done'}}, 
	RoundState: {READY: {value: 1, name:'Ready'}, DEALING: {value: 2, name: 'Dealing'}, PLAYING: {value: 3, name: 'Playing'}, DONE: {value: 4, name: 'Done'}}
});


exports.TractorGame = TractorGame;
exports.Player = Player;
exports.TractorRound = TractorRound;
exports.Flipping = Flipping;
