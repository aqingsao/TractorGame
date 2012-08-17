define(['common', 'app/cards', 'app/seats', 'app/round', 'broader'], function(Common, Cards, Seats, Round, broader){ 
	var Room = Common.Backbone.Model.extend({
		initialize: function(dealInterval){
			this.seats = Seats.prepareSeats();
			this.roomState = Rooms.RoomState.WAITING;
			this.cards = Cards.decks(2);
			this.dealInterval = 1 || dealInterval;
		},
		join: function(player, seatId){
			if(this.roomState != Rooms.RoomState.WAITING){
				throw "Cannot join this game";
			}
			// event.join 		
			this.seats.join(player, seatId);
			if(this.seats.full()){
				// event.ready
				this.roomState = Rooms.RoomState.PLAYING;
				this.nextRound(); 
				broader.onGameReady(this.get("id"));
			}
		},
		start: function(){
			if(this.roomState != Rooms.RoomState.PLAYING){
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
			return this.roomState == Rooms.RoomState.PLAYING && this.tractorRound != undefined && this.tractorRound.state == Round.RoundState.DEALING;
		}, 
		canStart: function(){
			return this.roomState == Rooms.RoomState.PLAYING && this.tractorRound != undefined && this.tractorRound.state == Round.RoundState.READY; 
		},
		// When at least player could flip, but he did not flip, will restart this round.
		noFlipping: function(){
			// event.restart round
		}
	});

	var Rooms = Common.Backbone.Collection.extend({ 
		initialize: function(){
			this.dealInterval = 100;
		},
		create: function(){  
			var count = this.size();
			var room = new Room({id: count + 1, dealInterval: this.dealInterval});
			this.add(room);                                  
			return room;
		}
	}, {
		RoomState: {WAITING: {value: 0, name: 'Waiting'}, PLAYING: {value: 3, name:'Playing'}, DONE: {value: 4, name: 'Done'}}
	});
	return Rooms;
});
