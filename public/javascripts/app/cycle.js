define(['backbone', 'underscore', 'app/rank', 'app/card', 'app/cards', 'app/hand'], function(Backbone, _, Rank, Card, Cards, Hand){
	var Cycle = Backbone.Model.extend({
		initialize: function(){
			this.set({currentSeatId: this.get("serverSeatId"), hands: new Backbone.Collection(), finished: false});
		},	
		isFinished: function(){
			return this.get("finished") == true;
		}, 
		canPlay: function(seatId){
			// user has cards; all suit are correct; user can 
			// user not played cards in this cycle
			return true;
		},
		playCards: function(seat, cards){
			if(!this.canPlay(seat.id)){
				throw "Seat " + seat.id + " cannot play cards turn.";
			}
			seat.playCards(cards);
			var hands = this.get("hands");
			hands.add(new Hand({seatId: seat.id, cards: cards}));
			if(hands.length >= 4){
				this.set({finished: true});
			}else{
				this.set({currentSeatId: seat.nextSeatId()});
			}
		}, 
		//TODO: find winner seat id
		getWinnerSeatId: function(){
			return 0;
		}, 
		fjod: function(json){
			var attributes = {};
			if(json.currentSeatId != undefined){
				attributes['currentSeatId'] = json.currentSeatId;
			}
			if(json.finished != undefined){
				attributes['finished'] = json.finished;
			}
		}
	}, {
		fjod: function(json){
			if(json == undefined){
				throw "Cycle.fjod: json is undefined";
			}
			var hands = new Backbone.Collection();
			_.each(json.hands, function(handJson){
				hands.add(Hand.fjod(handJson));
			});
			var cycle = new Cycle({serverSeatId: json.serverSeatId, currentSeatId: json.currentSeatId, hands: hands, finished: json.finshed});
			return cycle;
		}
	}); 
	return Cycle;
});
