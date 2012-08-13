var requirejs = require('requirejs');

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['backbone', 'underscore', 'util', './flipping', '../broader'], function(Backbone, _, util, Flipping, broader){  
	var Round = Backbone.Model.extend({
		initialize: function(cards, dealInterval, seats, roomNo){
			this.cards = cards;		
			this.state = Round.RoundState.READY;
			this.dealInterval= dealInterval;
			this.seats = seats;                                
			this.roomNo = roomNo;
			this.currentBanker = null;
			this.currentRank = null;
		},
		start: function(){
			if(this.state != Round.RoundState.READY){
				throw "This round cannot be started";
			}     		
			// event.start
			this.state = Round.RoundState.DEALING;
			this.deal();
		},
		deal: function(){
			var round = 1;
			var that = this;
			var cards = this.cards.shuffle();
			var dealSlow = function(){ 
				var i = 0;
				for(i = 0; i < 4; i++){
					var card = cards.shift(); 
					var seat = that.seats.seats.at(i);  
					seat.player.deal(card);
					broader.onDeal(that.roomNo, card, seat, round);
				}
				//event.deal
				if(round++ < 25){
					setTimeout(dealSlow, that.dealInterval);
				}else{
					// event.dealdone
					dealFinish();
				}
			};
			var dealFinish = function(){
				 broader.onDealFinish(that.roomNo);
			};
			dealSlow();
		}, 
		flip: function(player, cards){
			console.log("Player " + player.name +" is fliping: " + cards.toString());
			if(!player.hasCards(cards)){
				throw "You cannot flip cards";
			}
			var currentRank;
			var defenders = this.seats.defenders();
			if(defenders != undefined){
				curentRank = defenders.rank();
			};
			var flipping = new Flipping(player, cards, currentRank); 
			if(!flipping.isValid()){
				throw "You cannot flip cards";			
			}
			if(this.flipping != undefined && !flipping.canOverturn(this.flipping)){
				throw "You cannot overturn cards";	
			}
			// event.flip
			// this.defenders = this.seats.getPair(player); 
			this.flipping = flipping;
			this.seats.setDefender(player);
		}
	}, {
	   RoundState: {READY: {value: 1, name:'Ready'}, DEALING: {value: 2, name: 'Dealing'}, PLAYING: {value: 3, name: 'Playing'}, DONE: {value: 4, name: 'Done'}}
	});

	return Round;
});
