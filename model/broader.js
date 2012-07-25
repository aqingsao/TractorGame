var Backbone = require('backbone'),
	util = require('util'), 
	_ = require("underscore")._;
 
var io;
var Connection = Backbone.Model.extend({
	initialize: function(roomNo){
		this.roomNo = roomNo;  
		this.socketIds = [];
	},                        
	onJoin: function(seatId, player){ 
		var roomNo = this.roomNo;
		_.each(this.socketIds, function(socketId){   
			try{  
				console.log("Broadcast onJoin event to socket " + socketId);
				io.sockets.socket(socketId).emit("onJoin", {roomNo: roomNo, seatId: seatId, player: player.name});
			}catch(error){
				console.log("Failed to broadcast onJoin event to socket " + socketId +": " + error);
			}
		});
	}, 
	addSocket: function(socketId){
		this.socketIds.push(socketId);
	}, 
	onGameReady: function(){
	   	_.each(this.socketIds, function(socketId){   
			try{  
				console.log("Broadcast onGameReady event to socket " + socketId);
				io.sockets.socket(socketId).emit("onGameReady", {roomNo: roomNo});
			}catch(error){
				console.log("Failed to broadcast onGameReady event to socket " + socketId +": " + error);
			}
		}); 
	}
});
var Connections = Backbone.Collection.extend({
	getConnection: function(roomNo){
		var connection = this.find(function(connection){
			return connection.roomNo == roomNo;
		});
		if(connection == undefined){
			connection = new Connection(roomNo);
			this.add(connection);
		} 
		return connection;
	}
});  
var Broader = Backbone.Model.extend({
	init: function(tempIO){   
   	  	io = tempIO;
		var connections = new Connections();
		this.connections = connections;
		io.sockets.on('connection', function (socket) {
		  	socket.emit('connected', {});             
			socket.on("onRoom", function(data){   
				console.log("Socket " + socket.id + " is on room " + data.roomNo);
				connections.getConnection(data.roomNo).addSocket(socket.id);
			});
		}); 
	}, 
	onJoin: function(roomNo, seatId, player){
		this.connections.getConnection(roomNo).onJoin(seatId, player);
	}, 
	onNewRoom: function(roomNo){
		// this.connections.add(new Connection(roomNo));
	}, 
	onGameReady: function(roomNo){
	   this.connections.getConnection(roomNo).onGameReady(roomNo);    
	}
});                     
       
exports.Broader = new Broader();