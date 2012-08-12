var Backbone = require('backbone'), 
	Card = require('./card.js').Card, 
	util = require('util'),
	Seats = require('./seat.js').Seats, 
	Round = require('./tractor.js').Round,
	broader = require('../../model/broader.js').Broader;

var Room = Backbone.Model.extend({
	initialize: function(dealInterval){
		this.seats = Seats.prepareSeats();
		this.gameState = Room.RoomState.WAITING;
		this.cards = Card.decks(2);
		this.dealInterval = 1 || dealInterval;
	},
	join: function(player, seatId){
		if(this.gameState != Room.RoomState.WAITING){
			throw "Cannot join this game";
		}
		// event.join 		
		this.seats.join(player, seatId);
		if(this.seats.full()){
			// event.ready
			this.gameState = Room.RoomState.PLAYING;
			this.nextRound(); 
			broader.onGameReady(this.get("id"));
		}
	},
	start: function(){
		if(this.gameState != Room.RoomState.READY){
			throw "Game cannot be started";
		}
		this.gameState = Room.RoomState.PLAYING;
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
		return this.gameState == Room.RoomState.PLAYING && this.tractorRound != undefined && this.tractorRound.state == Round.RoundState.DEALING;
	}, 
	canStart: function(){
		return this.gameState == Room.RoomState.PLAYING && this.tractorRound != undefined && this.tractorRound.state == Round.RoundState.READY; 
	},
	// When at least player could flip, but he did not flip, will restart this round.
	noFlipping: function(){
		// event.restart round
	}
}, {
	RoomState: {WAITING: {value: 0, name: 'Waiting'}, PLAYING: {value: 3, name:'Playing'}, DONE: {value: 4, name: 'Done'}}
});


exports.Room = Room;