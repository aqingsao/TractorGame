define(['backbone', 'underscore', 'app/cards', 'app/seats', 'app/roomState', 'app/pair', 'app/rank', 'app/flipping'], function(Backbone, _, Cards, Seats, RoomState, Pair, Rank, Flipping){ 
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
				this.set({roomState: RoomState.READY, currentRank: Rank.TWO});
			}
		},
		start: function(){
			if(!this.canStart()){
				throw "Game cannot be started";
			}
			this.set({roomState: RoomState.DEALING});
			this.deal();
		},
		deal: function(){
			var round = 1;
			var self = this;
			var cards = this.get('cards').shuffle();
			var dealSlow = function(){ 
				var i = 0;
				for(i = 0; i < 4; i++){
					var card = cards.shift(); 
					var seat = self.get('seats').at(i);  
					seat.deal(card);
				}
				//event.deal
				if(round++ < 25){
					setTimeout(dealSlow, self.get('dealInterval'));
				}else{
					// event.dealdone
					dealFinish();
				}
			};
			var dealFinish = function(){
				self.set({roomState: RoomState.FLIPPING});
			};
			dealSlow();
		}, 
		flip: function(seat, cards){
			if(!this.canFlip()){
				throw "You cannot flip cards";
			}
			console.log("Player " + seat.playerName() +" is fliping: " + cards.toString());
			if(!seat.hasCards(cards)){
				throw "You cannot flip cards";
			}
			var flipping = new Flipping({defender: seat, currentRank: this.get('currentRank')}); 
			if(!flipping.flip(cards)){
				throw "You cannot flip cards";			
			}
			if(this.flipping != undefined && !flipping.canOverturn(this.flipping)){
				throw "You cannot overturn cards";	
			}
			// event.flip
			this.set({flipping: flipping});
			this.get('seats').setDefender(seat, this.get('currentRank'));
		}, 
		canFlip: function(){ 
			return this.get('roomState') == RoomState.FLIPPING || this.get('roomState') == RoomState.DEALING;
		}, 
		canStart: function(){ 
			return this.get('roomState') == RoomState.READY;
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
			seats.each(function(seat, index){
				if(!seat.isTaken()){count ++;}
			});
			return count;
		}, 
		getSeat: function(seatId){
			return this.get('seats').find(function(seat){
				return seat.id == seatId % 4;
			});
		}, 
		getSeatOfPlayer: function(player){
			return this.get('seats').find(function(seat){
				return seat.takenByPlayer(player);
			});
		}, 
		fjod: function(json){
			var attributes = {};
			if(json.roomState != undefined){
				attributes['roomState'] = RoomState.fjod(json.roomState);
			}
			if(json.round != undefined){
				attributes['round'] = Round.fjod(json.roomState);
			}

			this.set(attributes);
		}
	}, {
		fjod: function(json){
			var room = new Room(); 
			var roomState = RoomState.fjod(json.roomState);
			var seats = Seats.fjod(json.seats);
			var flipping = Flipping.fjod(json.flipping);
			var cards = Cards.fjod(json.cards);
			room.set({id: json.id, seats: seats, cards: cards, roomState: roomState, flipping: flipping});
			return room;
		}
	});
	return Room;  
});
