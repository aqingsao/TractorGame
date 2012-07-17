var Card = require('./card.js');

var GameState = {OPEN: {value: 0, name: '等待加入'}, READY: {value: 0, name: '准备就绪'}, PLAYING: {value: 0, name:''}, END: {value: 0, name: '已经结束'}};
var Player = Backbone.Model.extend({
	initialize: function(name){
		this.name = name;
	};
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
		players: [], 
		round: null, 
		decks = [new Deck(), new Deck()]; 
	},
});


exports.Tractor = Tractor;