define(['backbone', 'underscore'], function(Backbone, _){
	var io;
	var broadcastAll= function(event, data){
		try{  
			console.log("Broadcast event " + event +" to all sockets:");
			io.sockets.emit(event, data);
		}catch(error){
			console.log("Failed to broadcast event " + event + " to socket " + socketId +": " + error);
		}
	};
	var Connection = Backbone.Model.extend({
		initialize: function(roomId){
			this.roomId = roomId;  
			this.socketIds = [];
		},                        
		addSocket: function(socketId){
			this.socketIds.push(socketId);
		}, 
		broadcast: function(event, data){
			// console.log("Broadcast event " + event +" to " + this.socketIds.length + " sockets: " + util.inspect(data));
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
		initialize: function(){
			this.connections = new Backbone.Collection();
		},
		init: function(tempIO){   
	   	  	io = tempIO;
			var that = this;
			io.sockets.on('connection', function (socket) {
			  	socket.emit('connected', {});             
			}); 
		}, 
		roomStateChanged: function(roomId, roomState){
			broadcastAll('roomStateChanged', {roomId: roomId, roomState: roomState});
		},
		onJoin: function(roomId, seatId, player){
			this.getConnection(roomId).broadcast("onJoin", {roomId: roomId, seatId: seatId, player: player.get("name")});
		}, 
		onNewRoom: function(roomId){
			// this.connections.add(new Connection(roomId));
		}, 
		onDeal: function(roomId, card, seat, round){
		   this.getConnection(roomId).broadcast("onDeal", {roomId: roomId, card: {suit: card.get('suit').get('name'), rank: card.get('rank').get('name')}, seat: seat.get("id"), round: round});    
		},
		onDealFinish: function(roomId){
		   this.getConnection(roomId).broadcast("onDealFinish", {roomId: roomId});  
		},
		getConnection: function(roomId){
		   	var connection = this.connections.find(function(connection){
				return connection.roomId == roomId;
			});
			if(connection == undefined){
				connection = new Connection(roomId);
				this.connections.add(connection);
			} 
			return connection; 
		}
	});                     
	return new Broader();
});
