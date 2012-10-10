define(['backbone', 'underscore', 'app/rank', 'app/card', 'app/cards'], function(Backbone, _, Rank, Card, Cards){
	var Cycle = Backbone.Model.extend({
		initialize: function(){
			this.set({currentSeatId: this.get("fromSeat")});
		},	
		isFinished: function(){
			return this.get("currentSeatId") == -1;
		}, 
		canPlay: function(seatId){
			return this.get("currentSeatId") == seatId;
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
