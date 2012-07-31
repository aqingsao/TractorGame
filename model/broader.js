var Backbone = require('backbone'),
	util = require('util'), 
	_ = require("underscore")._;
 
var io;
var Connection = Backbone.Model.extend({
	initialize: function(roomNo){
		this.roomNo = roomNo;  
		this.socketIds = [];
	},                        
	addSocket: function(socketId){
		this.socketIds.push(socketId);
	}, 
	broadcast: function(event, data){
		console.log("Broadcast event " + event +" to " + this.socketIds.length + " sockets: " + util.inspect(data));
		 _.each(this.socketIds, function(socketId){   
			try{  
				console.log("Broadcast event " + event +" to " + socketId);
				io.sockets.socket(socketId).emit(event, data);
			}catch(error){
				console.log("Failed to broadcast event " + event + " to socket " + socketId +": " + error);
			}
		}); 
	}
});
var Broader = Backbone.Model.extend({
	init: function(tempIO){   
   	  	io = tempIO;
		this.connections = new Backbone.Collection();
		var that = this;
		io.sockets.on('connection', function (socket) {
		  	socket.emit('connected', {});             
			socket.on("onRoom", function(data){   
				console.log("Socket " + socket.id + " is on room " + data.roomNo);
				that.getConnection(data.roomNo).addSocket(socket.id);
			});
		}); 
	}, 
	onJoin: function(roomNo, seatId, player){
		this.getConnection(roomNo).broadcast("onJoin", {roomNo: roomNo, seatId: seatId, player: player.get("name")});
	}, 
	onNewRoom: function(roomNo){
		// this.connections.add(new Connection(roomNo));
	}, 
	onGameReady: function(roomNo){
	   this.getConnection(roomNo).broadcast("onGameReady", {roomNo: roomNo});  
	}, 
	onDeal: function(roomNo, card, seat, round){
	   this.getConnection(roomNo).broadcast("onDeal", {roomNo: roomNo, card: {suit: card.suit.name, rank: card.rank.name}, seat: seat.get("id"), round: round});    
	},
	onDealFinish: function(roomNo){
	   this.getConnection(roomNo).broadcast("onDealFinish", {roomNo: roomNo});  
	},
	getConnection: function(roomNo){
	   	var connection = this.connections.find(function(connection){
			return connection.roomNo == roomNo;
		});
		if(connection == undefined){
			connection = new Connection(roomNo);
			this.connections.add(connection);
		} 
		return connection; 
	}
});                     
       
exports.Broader = new Broader();