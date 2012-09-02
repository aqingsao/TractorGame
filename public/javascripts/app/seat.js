define(['backbone', 'underscore', 'app/rank', 'app/pair'], function(Backbone, _, Rank, Pair){
	var Seat = Backbone.Model.extend({
		initialize: function(){
			this.set({rank: Rank.TWO, defender: false, attacker: false});
		},	                         
		setDefender: function(isDefender){
			this.set({defender: isDefender, attacker: !isDefender});
		}, 
		join: function(player){
			if(this.isTaken()){   
				console.log("Seat cannot be taken as " + this.get("id") + " is already taken by " + this.get('player').get("name"));
				throw "Cannot take seat";
			}
			console.log("Seat " + this.get("id") + " is taken by " + player.get("name"));
			this.set({player: player});
		}, 
		isTaken: function(){
			return this.get('player') != undefined;
		}, 
		playerName: function(){   
			return this.get('player') == undefined ? "" : this.get('player').get("name");
		}
	}); 
	return Seat;
});
