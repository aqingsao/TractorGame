define(['backbone', 'underscore', 'app/flipping', 'broader'], function(Backbone, _, Flipping, broader){  
	var Round = Backbone.Model.extend({
		initialize: function(cards, dealInterval, seats, roomNo, currentRank){
			this.cards = cards;		
			this.state = Round.RoundState.READY;
			this.dealInterval= dealInterval;
			this.seats = seats;                                
			this.roomNo = roomNo;
			this.currentBanker = null;
			this.currentRank = currentRank;
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
					var seat = that.seats.at(i);  
					seat.get('player').deal(card);
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
			console.log("Player " + player.get('name') +" is fliping: " + cards.toString());
			if(!player.hasCards(cards)){
				throw "You cannot flip cards";
			}
			console.log("Player " + player.get('name') +" has cards: " + cards.toString());
			var defender = this.seats.defender();
			var flipping = new Flipping(player, cards, this.currentRank); 
			if(!flipping.isValid()){
				throw "You cannot flip cards";			
			}
			if(this.flipping != undefined && !flipping.canOverturn(this.flipping)){
				throw "You cannot overturn cards";	
			}
			// event.flip
			this.flipping = flipping;
			this.seats.setDefender(player, this.currentRank);
		}
	}, {
	   RoundState: {READY: {value: 1, name:'Ready'}, DEALING: {value: 2, name: 'Dealing'}, PLAYING: {value: 3, name: 'Playing'}, DONE: {value: 4, name: 'Done'}}
	});

	return Round;
});
