define(['backbone', 'underscore'], function(Backbone, _){
	var io;
	var broadcastAll= function(event, data){
		try{  
			console.log("Broadcast event " + event +" to all sockets:");
			io.sockets.emit(event, data);
		}catch(error){
			console.log("Failed to broadcast event " + event + " to socket : " + error);
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
		roomChanged: function(roomId, changed){
			broadcastAll('roomChanged', {roomId: roomId, changed: changed});
		},
		seatChanged: function(roomId, seatId, changed){
			broadcastAll('seatChanged', {roomId: roomId, seatId: seatId, changed: changed});
		},
		dealCard: function(roomId, seatId, card){
			broadcastAll('dealCard', {roomId: roomId, seatId: seatId, changed: card});
		},
		buryCard: function(roomId, seatId, card){
			broadcastAll('buryCard', {roomId: roomId, seatId: seatId, changed: card});
		},
		newCycle: function(roomId, cycle){
			broadcastAll('newCycle', {roomId: roomId, changed: cycle});
		},
		cycleChanged: function(roomId, cycleIndex, changed){
			broadcastAll('cycleChanged', {roomId: roomId, cycleIndex: cycleIndex, changed: changed});

		},
		newHand: function(roomId, cycleIndex, changed){
			broadcastAll('newHand', {roomId: roomId, cycleIndex: cycleIndex, changed: cycle});
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
