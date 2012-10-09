define(['backbone', 'underscore', 'app/cards', 'app/seats', 'app/roomState', 'app/pair', 'app/rank', 'app/flipping', 'app/seat'], function(Backbone, _, Cards, Seats, RoomState, Pair, Rank, Flipping, Seat){ 
	var Room = Backbone.Model.extend({
		defaults: {
			dealInterval: 1
		},                 
		initialize: function(){   
			var seats = Seats.prepareSeats();   
			this.set({seats: seats, roomState: RoomState.WAITING, cards: Cards.decks(2), currentRank: Rank.TWO});
		},
		join: function(player, seatId){
			if(this.get('roomState') != RoomState.WAITING){
				throw "Cannot join this game";
			}         
			this.get('seats').join(player, seatId);
			if(this.get('seats').full()){ 
				this.set({roomState: RoomState.READY});
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
			this.cards = this.get('cards').shuffle();
			var dealSlow = function(){ 
				var i = 0;
				for(i = 0; i < 4; i++){
					var card = self.cards.shift(); 
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
			var jokers = Cards.cards(cards.filter(function(card){return card.isJoker();}));
		 	var trumps = Cards.cards(cards.reject(function(card){return card.isJoker();})); 

			var flipping = new Flipping({currentRank: this.get('currentRank'), jokers: jokers, trumps: trumps}); 
			if(!flipping.valid()){
				throw "You cannot flip cards";			
			}
			if(this.flipping != undefined && !flipping.canOverturn(this.flipping)){
				throw "You cannot overturn cards";	
			}
			this.set({banker: seat.id, flipper: seat.id, flipping: flipping});

			var self = this;
			setTimeout(function(){
				self.dealRestToBanker(self.cards, seat);
				self.set({roomState: RoomState.BURYING});
			}, 5000);
		}, 
		dealRestToBanker: function(cards, seat){
			cards.each(function(card){
				seat.deal(card);
			});
		},
		canFlip: function(){ 
			return this.get('roomState') == RoomState.DEALING || this.get('roomState') == RoomState.FLIPPING;
		}, 
		canBury: function(){ 
			return this.get('roomState') == RoomState.BURYING;
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
		banker: function(){
			return this.getSeat(this.get('banker'));
		}, 
		flipper: function(){
			return this.getSeat(this.get('flipper'));
		}, 
		isBanker: function(seatId){
			return seatId == this.getSeat(this.get('banker')).id;
		},
		bury: function(seat, cards){
			if(!this.canBury()){
				throw "Cannot bury cards when room is " + this.get("roomState").get("name");
			}
			console.log("Player " + seat.playerName() +" is burying: " + cards.toString());

			if(cards.length != 8){
				throw 'cannot bury cards as there are ' + cards.length +" cards";
			}
			this.buryCards = seat.buryCards(cards);
			this.set({roomState: RoomState.PLAYING});
		}, 
		fjod: function(json){
			var attributes = {};
			if(json.roomState != undefined){
				attributes['roomState'] = RoomState.fjod(json.roomState);
			}
			if(json.round != undefined){
				attributes['round'] = Round.fjod(json.roomState);
			}
			if(json.flipping != undefined){
				attributes['flipping'] = Flipping.fjod(json.flipping);
			}
			if(json.banker != undefined){
				attributes['banker'] = json.banker;
			}
			if(json.flipper != undefined){
				attributes['flipper'] = json.flipper;
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
			room.set({id: json.id, seats: seats, cards: cards, roomState: roomState, flipping: flipping, banker: json.banker, flipper: json.flipper});
			return room;
		}
	});
	return Room;  
});
