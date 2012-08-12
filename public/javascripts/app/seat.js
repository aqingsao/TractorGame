var requirejs = require('requirejs');

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['backbone', 'util', './card'], function(Backbone, util, Card){ 
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
	return {
		Seat: Seat
	}
});
