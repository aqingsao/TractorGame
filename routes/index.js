var requirejs = require('requirejs');

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
});

var _ = require('underscore')._,
    Backbone = require('backbone'), 
	Card = require('../public/javascripts/card.js').Card;
	Room = require("../public/javascripts/room.js").Room,
	Rooms = require("../public/javascripts/room.js").Rooms,
	Player = require("../public/javascripts/player.js").Player; 
	util = require('util'), 
	broader = require("../model/broader.js").Broader; 
var Book = require('../public/javascripts/book.js').Book;
	
/*
 * GET home page.
 */

exports.index = function(req, res){ 
	res.render('index', { title: 'Express' })
};


console.log('init all tractor games');
var rooms = new Rooms();    
exports.tractors = function(req, res){
	console.log("------" + util.inspect(rooms));
	res.render('tractors', {rooms: rooms, title: 'Tractors'});
};
exports.tractor = function(req, res){
	var id = req.params.id;        
	var room = rooms.get(id);
	if(room == undefined){
		console.log("Open a new tractor room: " + id);
		room = rooms.create(); 
		broader.onNewRoom(id);
	}    
	res.render('tractor', {tractorGame: room, title: 'Tractor'});
};

exports.roomJoin = function(req, res){
	var id = req.params.id;
	var seatId = req.params.seatId;
	var room = rooms.get(id);
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

exports.roundStart = function(req, res){
	var id = req.params.id;
	var room = rooms.get(id);
	try{
		if(room == undefined){
			throw "Invalid room id " + id;
		}
		room.start();
		console.log("Start game in room " + id);
		res.json({});
	}catch(error){  
		console.log("Failed to start next round in room " + id + ": " + error);
		res.json({error: error, tractorGame: room.toJSON()}, 400);
	}
};
 
exports.tractorFlip = function(req, res){
	var id = req.params.id; 
	var playerName = req.body.name;
	var room = rooms.get(id);
	try{
		if(room == undefined){
			throw "Invalid room id " + id;
		}
		room.flip();
		console.log("Fliping in room " + id);
		res.json({});
	}catch(error){  
		console.log("Failed to flip in room " + id + ": " + error);
		res.json({error: error, tractorGame: room.toJSON()}, 400);
	}
};