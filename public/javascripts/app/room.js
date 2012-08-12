var requirejs = require('requirejs');

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(['backbone', 'util', './card', './seat', './tractor', '../../model/broader'], function(Backbone, util, Card, Seat, Round){
	var Room = Backbone.Model.extend({
		initialize: function(dealInterval){
			this.seats = Seats.prepareSeats();
			this.roomState = Room.RoomState.WAITING;
			this.cards = Card.decks(2);
			this.dealInterval = 1 || dealInterval;
		},
		join: function(player, seatId){
			if(this.roomState != Room.RoomState.WAITING){
				throw "Cannot join this game";
			}
			// event.join 		
			this.seats.join(player, seatId);
			if(this.seats.full()){
				// event.ready
				this.roomState = Room.RoomState.PLAYING;
				this.nextRound(); 
				broader.onGameReady(this.get("id"));
			}
		},
		start: function(){
			if(this.roomState != Room.RoomState.PLAYING){
				throw "Game cannot be started";
			}
			this.tractorRound.start();
		},
		flip: function(player, cards){
			if(!this.canFlip()){
				throw "You cannot flip cards";
			}
			this.tractorRound.flip(player, cards);
		}, 
		roundState: function(){
			return this.tractorRound ? this.tractorRound.state: null;
		}, 
		nextRound: function(){
			if(this.tractorRound != null && this.tractorRound.state != Round.RoundState.DONE){
				throw "Cannot play next round";
			}

			this.tractorRound = new Round(this.cards, this.dealInterval, this.seats, this.get("id"));
		}, 
		canFlip: function(){ 
			return this.roomState == Room.RoomState.PLAYING && this.tractorRound != undefined && this.tractorRound.state == Round.RoundState.DEALING;
		}, 
		canStart: function(){
			return this.roomState == Room.RoomState.PLAYING && this.tractorRound != undefined && this.tractorRound.state == Round.RoundState.READY; 
		},
		// When at least player could flip, but he did not flip, will restart this round.
		noFlipping: function(){
			// event.restart round
		}
	}, {
		RoomState: {WAITING: {value: 0, name: 'Waiting'}, PLAYING: {value: 3, name:'Playing'}, DONE: {value: 4, name: 'Done'}}
	});

	var maxRooms = 100;
	var Rooms = Backbone.Collection.extend({
		getRoom: function(roomNo){ 
			if(roomNo < 0 || roomNo > maxRooms){
				throw "Invalid room no " + roomNo;
			}

			return this.find(function(room){
				return room.get("id") == roomNo;
			});	
		}
	}); 
	return {
		Room: Room,
		Rooms: Rooms
	};
});
