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
var TractorRooms = Backbone.Collection.extend({
	getRoom: function(roomNo){ 
		if(roomNo < 0 || roomNo > maxRooms){
			throw "Invalid room no " + roomNo;
		}
		
		return this.find(function(room){
			return room.get("id") == roomNo;
		});	
	}
}); 
var tractorRooms = new TractorRooms();    
var maxRooms = 100;
var dealInterval = 100;
exports.tractor = function(req, res){
	var id = req.params.id;        
	var room = tractorRooms.getRoom(id);
	if(room == undefined){
		console.log("Open a new tractor room: " + id);
		room = new TractorGame({id: id, dealInterval: dealInterval}); 
		tractorRooms.add(room);   
		broader.onNewRoom(id);
	}    
	res.render('tractor', {tractorGame: room, title: 'Tractor'});
};

exports.tractorJoin = function(req, res){
	var id = req.params.id;
	var seatId = req.params.seatId;
	var room = tractorRooms.getRoom(id);
	if(room == undefined){
		throw "Invalid room id " + id;
	}
	var player = new Player({name: req.body.name});   
	try{
		console.log("Player " + player.get("name") + "  is joining room " + id + " on seat " + seatId);
		room.join(player, seatId); 
		broader.onJoin(id, seatId, player);
		                       
		res.json(player.toJSON());
	}catch(error){  
		console.log("Player " + player.get("name") + " failed to join room " + id + " on seat " + seatId +": " + error);
		res.json({error: error}, 400);
	}
}; 

exports.tractorStart = function(req, res){
	var id = req.params.id;
	var room = tractorRooms.getRoom(id);
	try{
		if(room == undefined){
			throw "Invalid room id " + id;
		}
		room.start();
		console.log("Start game in room " + id);
		res.json({});
	}catch(error){  
		console.log("Failed to start game in room " + id + ": " + error);
		res.json({error: error, tractorGame: room.toJSON()}, 400);
	}
};
 
exports.tractorFlip = function(req, res){
	var id = req.params.id; 
	var playerName = req.body.name;
	var room = tractorRooms.getRoom(id);
	try{
		if(room == undefined){
			throw "Invalid room id " + id;
		}
		room.flip();
		console.log("Start game in room " + id);
		res.json({});
	}catch(error){  
		console.log("Failed to start game in room " + id + ": " + error);
		res.json({error: error, tractorGame: room.toJSON()}, 400);
	}
};