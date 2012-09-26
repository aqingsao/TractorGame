define(['backbone', 'underscore', 'app/rank', 'app/pair', 'app/seat'], function(Backbone, _, Rank, Pair, Seat){
	var Seats = Backbone.Collection.extend({
		model: Seat,
		initialize: function(){
		},
		full: function(){		
			return this.all(function(seat){
				return seat.isTaken();
			});
		},
		join: function(player, seatIndex){   
			if(seatIndex < 0 || seatIndex > 3){  
				throw "Cannot take seat as seatIndex invalid";
			}
			if(this.hasPlayer(player)){ 
				console.log('Player ' + player.get('name') +' hass already taken a seat in this room.');
				throw "Cannot take seat as player already take seat";
			} 		  
			this.at(seatIndex).join(player);
		}, 
		getPlayer: function(seatIndex){
			return this.seats.at(seatIndex).player;
		}, 
		setDefender: function(seat, currentRank){  
			var seatIndex = this.indexOf(seat);
			var pairSeatIndex = (seatIndex + 2) % 4;
			this.each(function(seat, index){
				if(index == seatIndex || index == pairSeatIndex){
					seat.setDefender(currentRank);
				}                          
				else{
					seat.setAttacker(currentRank);
				}
			});
		}, 
		hasPlayer: function(player){
			return this.any(function(seat){
				return seat.player != undefined && seat.player.equals(player);
			});
		}, 
		players: function(){
			return this.map(function(seat){
				return seat.player;
			});
		},
		playersCanFlip: function(){
			return _.find(this.players(), function(player){
				return player != undefined && player.canFlip();
			});
		}, 
		getSeatOfPlayer: function(player){
			return this.find(function(seat){
				return seat.takenByPlayer(player);
			});
		},
		getSeat: function(direction){ 
			var seatIndex;
			switch(direction){
				case 'N':
				case 'north':
					seatIndex = 0;
					break;
				case 'W':
				case 'west':
					seatIndex = 1;
					break;
				case 'S':
				case 'south':
					seatIndex = 2;
					break;
				case 'E':
				case 'east':
					seatIndex = 3;
				    break;
			}  

			var seat = this.at(seatIndex); 
			return seat;
		}, 
		defender: function(){
			return this.find(function(seat){
				return seat.get('defender') == true;
			});
		}
	}, {
		prepareSeats: function(){
			return new Seats([new Seat({id:0}), new Seat({id:1}), new Seat({id:2}), new Seat({id:3})]);			
		}, 
		fjod: function(json){
			var seatArray = [];
			_.each(json, function(seat){
				seatArray.push(Seat.fjod(seat));
			});

			return new Seats(seatArray);
		}
	});
	return Seats;
});
