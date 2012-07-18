var Backbone = require('backbone'), 
	_ = require('underscore')._,
	Card = require('./card.js');

var GameState = {OPEN: {value: 0, name: '等待加入'}, READY: {value: 0, name: '准备就绪'}, PLAYING: {value: 0, name:''}, END: {value: 0, name: '已经结束'}};
var Player = Backbone.Model.extend({
	initialize: function(name){
		this.name = name;
		this.cards =new Backbone.Collection();
	},
	deal: function(card){
		this.cards.add(card);
	}
});
var TractorRound = Backbone.Model.extend({
	initialize: function(){
		
	},
	flip: function(){
		
	}, 
	bury: function(cards){
		
	}
});
var TractorGame = Backbone.Model.extend({
	initialize: function(){
		this.players = [], 
		this.round = 0, 
		this.decks = [new Deck(), new Deck()]; 
	},
});


exports.Tractor = TractorGame;