define(['backbone', 'underscore', 'app/rank', 'app/card', 'app/cards'], function(Backbone, _, Rank, Card, Cards){
	var Cycle = Backbone.Model.extend({
		initialize: function(){
			this.set({currentSeatId: this.get("serverSeatId")})
		},	
		isFinished: function(){
			return this.get("finished") != undefined;
		}, 
		canPlay: function(seatId){
			return this.get("currentSeatId") == seatId;
		},
		playCards: function(seatId, cards){
			if(!this.canPlay(seatId)){
				throw "Seat " + seatId + " cannot play cards as it's " + this.get("currentSeatId") + "'s turn.";
			}
			this.set({seatId: cards});
		}, 
		getWinnerSeatId: function(){
			return this.get("currentSeatId");
		}               
		
	}, {
		fjod: function(json){
			if(json == undefined){
				return undefined;
			}
			return undefined;
		}
	}); 
	return Cycle;
});
