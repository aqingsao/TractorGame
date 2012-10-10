define(['backbone', 'underscore', 'app/rank', 'app/card', 'app/cards', 'app/cycle'], function(Backbone, _, Rank, Card, Cards, Cycle){
	var Cycles = Backbone.Collection.extend({
		model: Cycle,
		initialize: function(){
		},
		nextCycle: function(fromSeatId){
			if(this.length > 0){
				var currentCycle = this.at(this.length - 1);
				if(!currentCycle.isFinished()){
					throw "Cycle " + currentCycle.get("index") +" has not been finished yet";
				}
			}
			var cycle = new Cycle({index: this.length, fromSeat: fromSeatId});
			this.add(cycle);
			return cycle;
		}, 
		currentCycle: function(){
			return this.length > 0 ? this.at(this.length - 1) : undefined;
		}
	}, {
		fjod: function(json){
			if(json == undefined){
				return undefined;
			}
			return undefined;
		}
	}); 
	return Cycles;
});
