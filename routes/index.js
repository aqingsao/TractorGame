var _ = require('underscore')._,
    Backbone = require('backbone'), 
	Card = require('./card.js').Card;
	TractorGame = require("./tractor.js").TractorGame,
	Player = require("./tractor.js").Player; 
	util = require('util');
	
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', { title: 'Express' })
};


console.log('init all tractor games');
var tractorGames = new Backbone.Collection();     
var maxRooms = 100;
var dealInterval = 100;
exports.tractor = function(req, res){
	var id = req.params.id;        
	if(id < 0 || id > maxRooms){
		throw "Invalid room id " + id;
	}
	var tractorGame = tractorGames.find(function(game){
		return game.id == id;
	});
	if(tractorGame == undefined){
		console.log("Open a new tractor room: " + id);
		tractorGame = new TractorGame({id: id, dealInterval: dealInterval}); 
		tractorGames.add(tractorGame);
	}    
	res.render('tractor', {tractorGame: tractorGame, title: 'Tractor'});
};

exports.tractorJoin = function(req, res){
	var id = req.params.id;
	var seatId = req.params.seatId;
	var tractorGame = tractorGames.find(function(game){
		return game.id == id;
	});
	if(tractorGame == undefined){
		throw "Invalid room id " + id;
	}
	var player = new Player({name: req.body.name});   
	try{
		tractorGame.join(player, seatId);    
		res.json(player.toJSON());
	}catch(error){
		res.json(error, 400);
	}
};