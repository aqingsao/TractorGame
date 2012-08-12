var Backbone = require('backbone'), 
	Card = require('./card.js').Card, 
	util = require('util'), 
	Pair = require('./player').Pair,
	Round = require('./tractor.js').Round;

var Seat = Backbone.Model.extend({
	initialize: function(){
		this.rank = Card.Ranks.TWO;
	},	
	join: function(player){
		if(this.isTaken()){   
			console.log("Seat cannot be taken as " + this.get("id") + " is already taken by " + this.player.get("name"));
			throw "Cannot take seat";
		}
		this.player = player;
	}, 
	isTaken: function(){
		return this.player != undefined;
	}, 
	playerName: function(){   
		return this.player == undefined ? "" : this.player.get("name");
	}
});
var Seats = Backbone.Model.extend({
	initialize: function(seat0, seat1, seat2, seat3){
		this.seats = new Backbone.Collection();
		this.seats.add(seat0);
		this.seats.add(seat1);
		this.seats.add(seat2);
		this.seats.add(seat3);
		this.pairs = new Backbone.Collection();
		this.pairs.add(new Pair("team0", seat0, seat2)); 
		this.pairs.add(new Pair("team1", seat1, seat3));
	},
	full: function(){		
		return this.seats.all(function(seat){
			return seat.isTaken();
		});
	},
	join: function(player, seatIndex){
		if(seatIndex < 0 || seatIndex > 3){  
			console.log("Seat cannot be taken as invalid seat index " + seatIndex);
			
			throw "Cannot take seat";
		}
		if(this.hasPlayer(player)){ 
			console.log("Seat cannot be taken as player " + player.get("name") + " has already taken seat in this room");
			
			throw "Cannot take seat";
		} 		  
		this.seats.at(seatIndex).join(player);
	}, 
	defenders: function(){
		return this.pairs.find(function(pair){
			if(pair.isDefenders){
				return pair;
			}
		});
	}, 
	attackers: function(){
		return this.pairs.find(function(pair){
			if(pair.isAttackers){
				return pair;
			}
		});
	}, 
	getPlayer: function(seatIndex){
		return this.seats.at(seatIndex).player;
	}, 
	setDefender: function(player){
		this.pairs.each(function(pair){
			pair.setDefender(pair.hasPlayer(player));
		});
	}, 
	hasPlayer: function(player){
		return this.seats.any(function(seat){
			return seat.player != undefined && seat.player.equals(player);
		});
	}, 
	getPair: function(player){
		return this.pairs.find(function(pair){
			return pair.hasPlayer(player);
		});
	}, 
	players: function(){
		return this.seats.map(function(seat){
			return seat.player;
		});
	},
	playersCanFlip: function(){
		return _.find(this.players(), function(player){
			return player != undefined && player.canFlip();
		});
	}, 
	getSeat: function(direction){ 
		var seatIndex;
		switch(direction){
			case 'N':
				seatIndex = 0;
				break;
			case 'W':
				seatIndex = 1;
				break;
			case 'S':
				seatIndex = 2;
				break;
			case 'E':
				seatIndex = 3;
			    break;
		}  
		
		var seat = this.seats.at(seatIndex); 
		return seat;
	}
}, {
	prepareSeats: function(){
		return new Seats(new Seat({id:0}), new Seat({id:1}), new Seat({id:2}), new Seat({id:3}));
	}
});

exports.Seats = Seats;