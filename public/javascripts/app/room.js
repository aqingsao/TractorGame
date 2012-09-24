define(['backbone', 'underscore', 'app/cards', 'app/seats', 'app/round', 'app/roomState', 'app/pair', 'app/rank'], function(Backbone, _, Cards, Seats, Round, RoomState, Pair, Rank){ 
	var Room = Backbone.Model.extend({
		defaults: {
			dealInterval: 1
		},                 
		initialize: function(){   
			var seats = Seats.prepareSeats();   
			this.set({seats: seats, roomState: RoomState.WAITING, cards: Cards.decks(2)});
		},
		join: function(player, seatId){
			if(this.get('roomState') != RoomState.WAITING){
				throw "Cannot join this game";
			}         
			this.get('seats').join(player, seatId);
			if(this.get('seats').full()){ 
				// event.ready 				
				this.set({roomState: RoomState.PLAYING});
				this.nextRound(Rank.TWO); 
				// broader.onGameReady(this.get("id"));
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
		nextRound: function(currentRank){
			if(this.tractorRound != null && this.tractorRound.state != Round.RoundState.DONE){
				throw "Cannot play next round";
			}
	
			this.tractorRound = new Round(this.get('cards'), this.get('dealInterval'), this.get('seats'), this.get("id"), currentRank);
		}, 
		canFlip: function(){ 
			return this.get('roomState') == RoomState.PLAYING && this.tractorRound != undefined && this.tractorRound.state == Round.RoundState.DEALING;
		}, 
		canStart: function(){
			return this.get('roomState') == RoomState.PLAYING && this.tractorRound != undefined && this.tractorRound.state == Round.RoundState.READY; 
		}, 
		equals: function(another){
			for(var key in this.attributes){
				var val = this.attributes[key];
				if(typeof(val.equals) == 'function' && !val.equals(another.get(key))){
					return false;
				}                
				else if(val != another.get(key)){
					return false;
				}
			}
			return true;
		}, 
		availableSeats: function(){
			var seats = this.get('seats');
			var count = 0; 
			console.log(seats.length);
			seats.each(function(seat, index){
				console.log("Seat  is taken: "+  seat.isTaken());
				if(!seat.isTaken()){count ++;}
			});
			return count;
		}, 
		defenders: function(){
			return this.get('pairs').find(function(pair){
				if(pair.isDefender()){
					return pair;
				}
			});
		}, 
		attackers: function(){
			return this.get('pairs').find(function(pair){
				if(pair.isAttacker()){
					return pair;
				}
			});
		}, 
		getSeat: function(seatId){
			return this.get('seats').find(function(seat){
				return seat.id == seatId % 4;
			});
		}, 
		fjod: function(json){
			var attributes = {};
			if(json.roomState != undefined){
				var state = json.roomState.name;
				switch(json.roomState.name){
					case 'Done':
						attributes['roomState'] = RoomState.DONE;
						break;
					case 'Playing':
						attributes['roomState'] = RoomState.PLAYING;
						break;
					default:
						attributes['roomState'] = RoomState.WAITING;
						break;
				}
			}
			this.set(attributes);
		}
	}, {
		fjod: function(json){
			var room = new Room(); 
			var cards = Cards.fjod();
			var roomState = RoomState.WAITING;
			var seats = Seats.fjod(json.seats);
			room.set({id: json.id, seats: seats, cards: cards, roomState: roomState});
			return room;
		}
	});
	return Room;  
});
