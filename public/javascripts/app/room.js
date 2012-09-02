define(['backbone', 'underscore', 'app/cards', 'app/seats', 'app/round', 'app/roomState'], function(Backbone, _, Cards, Seats, Round, RoomState){ 
	var Room = Backbone.Model.extend({
		defaults: {
			dealInterval: 1
		},                 
		initialize: function(){
			this.set({seats: Seats.prepareSeats(), roomState: RoomState.WAITING, cards: Cards.decks(2)});
		},
		join: function(player, seatId){
			if(this.get('roomState') != RoomState.WAITING){
				throw "Cannot join this game";
			}         
			this.get('seats').join(player, seatId);
			if(this.get('seats').full()){ 
				// event.ready 				
				this.set({roomState: RoomState.PLAYING});
				this.nextRound(); 
				broader.onGameReady(this.get("id"));
			}
		},
		start: function(){
			if(this.get('roomState') != RoomState.PLAYING){
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
	
			this.tractorRound = new Round(this.get('cards'), this.get('dealInterval'), this.get('seats'), this.get("id"));
		}, 
		canFlip: function(){ 
			return this.get('roomState') == RoomState.PLAYING && this.tractorRound != undefined && this.tractorRound.state == Round.RoundState.DEALING;
		}, 
		canStart: function(){
			return this.get('roomState') == RoomState.PLAYING && this.tractorRound != undefined && this.tractorRound.state == Round.RoundState.READY; 
		}
	}, {
		fromJSON: function(json){
			var room = new Room();
			room.set(json);
			return room;
		}
	});
	return Room;  
});
