define(['common', 'app/cards', 'app/seats', 'app/round', 'broader'], function(Common, Cards, Seats, Round, broader){ 
	var Room = Common.Backbone.Model.extend({
		defaults: {
			cards: Cards.decks(2),
			dealInterval: 1
		},                 
		initialize: function(){
			this.set('seats', Seats.prepareSeats());
			this.set('roomState', Rooms.RoomState.WAITING);
		},
		join: function(player, seatId){
			if(this.get('roomState') != Rooms.RoomState.WAITING){
				throw "Cannot join this game";
			}         
			this.get('seats').join(player, seatId);
			if(this.get('seats').full()){
				// event.ready
				this.set('roomState', Rooms.RoomState.PLAYING);
				this.nextRound(); 
				broader.onGameReady(this.get("id"));
			}
		},
		start: function(){
			if(this.get('roomState') != Rooms.RoomState.PLAYING){
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
			return this.get('roomState') == Rooms.RoomState.PLAYING && this.tractorRound != undefined && this.tractorRound.state == Round.RoundState.DEALING;
		}, 
		canStart: function(){
			return this.get('roomState') == RoomState.PLAYING && this.tractorRound != undefined && this.tractorRound.state == Round.RoundState.READY; 
		}
	});
	var RoomState = function(name){this.name = name};

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
		RoomState: {WAITING: new RoomState('Waiting'), PLAYING: new RoomState('Playing'),DONE: new RoomState('Done')}
	});
	return Rooms;
});
