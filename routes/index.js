var _ = require('underscore')._,
    Backbone = require('backbone'), 
	Card = require('./card.js').Card;
	TractorGame = require("./tractor.js").TractorGame,
	Player = require("./tractor.js").Player; 
	util = require('util'), 
	broader = require("../model/broader.js").Broader;
	
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
		broader.onNewRoom(id);
		
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
		console.log("Player " + player.get("name") + "  is joining room " + id + " on seat " + seatId);
		tractorGame.join(player, seatId); 
		broader.onJoin(id, seatId, player);
		                       
		res.json(player.toJSON());
	}catch(error){  
		console.log("Player " + player + " failed to join room " + id + " on seat " + seatId +": " + error);
		res.json(error, 400);
	}
};