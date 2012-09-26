define(['backbone', 'underscore', 'app/cards'], function(Backbone, _, Cards){
	var Player = Backbone.Model.extend({
		equals: function(another){
			return this.get("name") == another.get("name");
		}, 
		fjod: function(json){
			var attributes = {};
			if(json.name != undefined){
				attributes[name] = json.name;
			}
			this.set(attributes);
		}
	}, {
		fjod: function(json){
			if(json == undefined){
				return undefined;
			}
			return new Player({name: json.name});
		}
	});
	return Player;
});