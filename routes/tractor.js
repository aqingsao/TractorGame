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
	}
});
var Players = Backbone.Collection.extend({
	full: function(){
		return this.size() >= 4;
	}, 
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
	initialize: function(cards, dealInterval, players){
		this.cards = cards;		
		this.state = TractorGame.RoundState.READY;
		this.dealInterval= dealInterval;
		this.players = players;
	},
	start: function(){
		if(this.state != TractorGame.RoundState.READY){
			throw "This round cannot be started";
		}
		this.state = TractorGame.RoundState.FLIPING;
		this.deal();
	},
	deal: function(){
		var i = 0;
		var that = this;
		var dealSlow = function(){
			var card = that.cards.shift();
			that.players.at(i%4).deal(card);
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
		this.flipping = flipping;
	},
	canFlip: function(player, flipCards){
		var cardsSoFar = player.cards;
		flipCards.each(function(card){
			if(!cardsSoFar.contains(card)){
				return false;
			}
		});
		
	},
	bury: function(cards){
		
	}
});
var TractorGame = Backbone.Model.extend({
	initialize: function(dealInterval){
		this.players = new Players(), 
		this.gameState = TractorGame.GameState.WAITING;
		this.cards = Card.decks(2);
		this.dealInterval = 1 || dealInterval;
	},
	join: function(player){
		// if(this.gameState != TractorGame.GameState.AITING){
			// throw "Cannot join this game";
		// }
		this.players.add(player);
		if(this.players.full()){
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
		
		this.tractorRound = new TractorRound(this.cards, this.dealInterval, this.players);
	}
}, {
	GameState: {WAITING: {value: 0, name: 'Waiting'}, READY: {value: 0, name: 'Ready'}, PLAYING: {value: 0, name:'Playing'}, DONE: {value: 0, name: 'Done'}}, 
	RoundState: {READY: {value: 1, name:'Ready'}, FLIPING: {value: 2, name: 'Fliping'}, PLAYING: {value: 3, name: 'Playing'}, DONE: {value: 4, name: 'Done'}}
});


exports.TractorGame = TractorGame;
exports.Player = Player;
exports.TractorRound = TractorRound;
exports.Flipping = Flipping;
