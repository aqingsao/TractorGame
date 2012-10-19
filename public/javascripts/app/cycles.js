define(['backbone', 'underscore', 'app/rank', 'app/card', 'app/cards', 'app/cycle'], function(Backbone, _, Rank, Card, Cards, Cycle){
	var Cycles = Backbone.Collection.extend({
		model: Cycle,
		initialize: function(){
		},
		currentCycle: function(){
			return this.length > 0 ? this.at(this.length - 1) : undefined;
		}
	}, {
		fjod: function(json){
			if(json == undefined){
				return undefined;
			}
			var cycles = new Cycles();
			_.each(json, function(cycleJson){
				cycles.add(Cycle.fjod(cycleJson), {silent: true});
			});

			return cycles;
		}
	}); 
	return Cycles;
});
