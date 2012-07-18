var Backbone = require('backbone'), 
	_ = require('underscore')._,
	Card = require('./card.js').Card;

var Player = Backbone.Model.extend({
	initialize: function(name){
		this.name = name;
		this.cards = new Backbone.Collection();
	},
	deal: function(card){
		this.cards.add(card);
	}
});

var TractorRound = Backbone.Model.extend({
	initialize: function(cards){
		this.cards = cards;
		this.state = TractorGame.RoundState.READY;
	},
	start: function(){
		if(this.state != TractorGame.RoundState.READY){
			throw "This round cannot be started";
		}
		this.state = TractorGame.RoundState.FLIPING;
		this.flip();
	},
	flip: function(){
		
	}, 
	bury: function(cards){
		
	}
});
var TractorGame = Backbone.Model.extend({
	initialize: function(){
		this.players = new Backbone.Collection(), 
		this.gameState = TractorGame.GameState.WAITING;
		this.cards = Card.decks(2);
	},
	join: function(player){
		if(this.gameState != TractorGame.GameState.WAITING){
			throw "Cannot join this game";
		}
		this.players.add(player);
		if(this.players.size() == 4){
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
		console.log("shuffle----" + this.cards.shuffle());
		this.tractorRound = new TractorRound(this.cards);
	}
}, {
	GameState: {WAITING: {value: 0, name: 'Waiting'}, READY: {value: 0, name: 'Ready'}, PLAYING: {value: 0, name:'Playing'}, DONE: {value: 0, name: 'Done'}}, 
	RoundState: {READY: {value: 1, name:'Ready'}, FLIPING: {value: 2, name: 'Fliping'}, PLAYING: {value: 3, name: 'Playing'}, DONE: {value: 4, name: 'Done'}}
});


exports.TractorGame = TractorGame;
exports.Player = Player;
exports.TractorRound = TractorRound;
