var Backbone = require('backbone'), 
	_ = require('underscore')._,
	Card = require('./card.js').Card, 
	util = require('util'), 
	broader = require('../../model/broader.js').Broader, 
	Flipping = require("./flipping.js"), 
	Pair = require('./player.js').Pair, 
	Player = require('./player.js').Player;

var Seat = Backbone.Model.extend({
	initialize: function(){
		this.rank = Card.Ranks.TWO;
	},	
	join: function(player){
		if(this.isTaken()){   
			console.log("Seat cannot be taken as " + this.get("id") + " is already taken by " + this.player.get("name"));
			throw "Cannot take seat";
		}
		this.player = player;
	}, 
	isTaken: function(){
		return this.player != undefined;
	}, 
	playerName: function(){   
		return this.player == undefined ? "" : this.player.get("name");
	}
});
var Seats = Backbone.Model.extend({
	initialize: function(seat0, seat1, seat2, seat3){
		this.seats = new Backbone.Collection();
		this.seats.add(seat0);
		this.seats.add(seat1);
		this.seats.add(seat2);
		this.seats.add(seat3);
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
			console.log("Seat cannot be taken as invalid seat index " + seatIndex);
			
			throw "Cannot take seat";
		}
		if(this.hasPlayer(player)){ 
			console.log("Seat cannot be taken as player " + player.get("name") + " has already taken seat in this room");
			
			throw "Cannot take seat";
		} 		  
		this.seats.at(seatIndex).join(player);
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
		
		var seat = this.seats.at(seatIndex); 
		return seat;
	}
}, {
	prepareSeats: function(){
		return new Seats(new Seat({id:0}), new Seat({id:1}), new Seat({id:2}), new Seat({id:3}));
	}
});
var TractorRound = Backbone.Model.extend({
	initialize: function(cards, dealInterval, seats, roomNo){
		this.cards = cards;		
		this.state = TractorGame.RoundState.READY;
		this.dealInterval= dealInterval;
		this.seats = seats;                                
		this.roomNo = roomNo;
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
		var round = 1;
		var that = this;
		var cards = this.cards.shuffle();
		var dealSlow = function(){ 
			var i = 0;
			for(i = 0; i < 4; i++){
				var card = cards.shift(); 
				var seat = that.seats.seats.at(i);  
				seat.player.deal(card);
				broader.onDeal(that.roomNo, card, seat, round);
			}
			//event.deal
			if(round++ < 25){
				setTimeout(dealSlow, that.dealInterval);
			}else{
				// event.dealdone
				dealFinish();
			}
		};
		var dealFinish = function(){
			 broader.onDealFinish(that.roomNo);
		};
		dealSlow();
	}, 
	flip: function(player, cards){
		console.log("Player " + player.name +" is fliping: " + cards.toString());
		if(!player.hasCards(cards)){
			throw "You cannot flip cards";
		}
		var currentRank;
		var defenders = this.seats.defenders();
		if(defenders != undefined){
			curentRank = defenders.rank();
		};
		var flipping = new Flipping(player, cards, currentRank); 
		if(!flipping.isValid()){
			throw "You cannot flip cards";			
		}
		if(this.flipping != undefined && !flipping.canOverturn(this.flipping)){
			throw "You cannot overturn cards";	
		}
		// event.flip
		// this.defenders = this.seats.getPair(player); 
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
	join: function(player, seatId){
		if(this.gameState != TractorGame.GameState.WAITING){
			throw "Cannot join this game";
		}
		// event.join 		
		this.seats.join(player, seatId);
		if(this.seats.full()){
			// event.ready
			this.gameState = TractorGame.GameState.PLAYING;
			this.nextRound(); 
			broader.onGameReady(this.get("id"));
		}
	},
	start: function(){
		if(this.gameState != TractorGame.GameState.READY){
			throw "Game cannot be started";
		}
		this.gameState = TractorGame.GameState.PLAYING;
		this.tractorRound.start();
	},
	flip: function(player, cards){
		if(!this.canFlip()){
			throw "You cannot flip cards";
		}
		this.tractorRound.flip(player, cards);
	}, 
	roundState: function(){
		return this.tractorRound ? this.tractorRound.state: null;
	}, 
	nextRound: function(){
		if(this.tractorRound != null && this.tractorRound.state != TractorGame.RoundState.DONE){
			throw "Cannot play next round";
		}
		
		this.tractorRound = new TractorRound(this.cards, this.dealInterval, this.seats, this.get("id"));
	}, 
	canFlip: function(){ 
		return this.gameState == TractorGame.GameState.PLAYING && this.tractorRound != undefined && this.tractorRound.state == TractorGame.RoundState.DEALING;
	}, 
	canStart: function(){
		return this.gameState == TractorGame.GameState.PLAYING && this.tractorRound != undefined && this.tractorRound.state == TractorGame.RoundState.READY; 
	},
	// When at least player could flip, but he did not flip, will restart this round.
	noFlipping: function(){
		// event.restart round
	}
}, {
	GameState: {WAITING: {value: 0, name: 'Waiting'}, PLAYING: {value: 3, name:'Playing'}, DONE: {value: 4, name: 'Done'}}, 
	RoundState: {READY: {value: 1, name:'Ready'}, DEALING: {value: 2, name: 'Dealing'}, PLAYING: {value: 3, name: 'Playing'}, DONE: {value: 4, name: 'Done'}}
});


exports.TractorGame = TractorGame;
exports.TractorRound = TractorRound;
