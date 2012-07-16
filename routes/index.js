var _ = require('underscore')._,
    Backbone = require('backbone');
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', { title: 'Express' })
};

var GameState = {OPEN: {value: 0, name: '等待加入'}, READY: {value: 0, name: '准备就绪'}, PLAYING: {value: 0, name:''}, END: {value: 0, name: '已经结束'}};
var Player = Backbone.Model.extend({
	
});
var SUIT = {HEART: {value: 0}, SPADE: {value: 1}, DIAMOND: {value:2}, CLUB: {value:3}, JOKER: {value: 4}};
var Card = {TWO: {value: 2, point: 0}, THREE: {value: 3, point: 0}, FOUR: {value: 4, point: 0}, FIVE: {value: 5, point: 5}, 
SIX: {value: 6, point: 0}, , SEVEN: {value: 7, point: 0}, EIGHT: {value: 8, point: 0}, NINE: {value: 9, point: 0},
TEN: {value: 10, point: 10}, JACK: {value: 3, point: 0}, QUEEN: {value: 3, point: 0}, KING: {value: 3, point: 10},
ACE: {value: 14, point: 0}, SMALL_JOKER: {value: 300, point: 0}, BIG_JOKER: {value: 500, point: 0}}; 
var Card = Backbone.Model.extend({
	
});
var Deck = Backbone.Model.extend（{
	initialize: function(){
		this.bigJokers = [];
	};
});
var Trick = Backbone.Model.extend({
	
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

console.log('init all tractor games');
var tractorGames = {};
exports.tractor = function(req, res){
	var id = req.params.id;
	if(tractorGames[id] == null){
		console.log("Open a new tractor room: " + id);
		tractorGames[id] = new TractorGame();
	}
	res.render('tractor', {tractorGame: tractorGames[id], title: 'Tractor'});
}