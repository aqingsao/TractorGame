define(['backbone', 'underscore', 'app/rank', 'app/pair', 'app/player'], function(Backbone, _, Rank, Pair, Player){
	var Seat = Backbone.Model.extend({
		initialize: function(){
			this.set({rank: Rank.TWO, defender: false, attacker: false});
		},	                         
		setDefender: function(currentRank){
			this.set({defender: true, attacker: false});
		}, 
		setAttacker: function(currentRank){
			this.set({defender: false, attacker: true});
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
		}, 
		takenByPlayer: function(player){
			return player.get('name') == this.playerName();
		}
	}, {
		fjod: function(json){
			var seat = new Seat();
			seat.id= json.id;
			seat.set({id: json.id, rank: json.rank, defender: json.defender, attacker: json.attacker, player: Player.fjod(json.player)});
			return seat;
		}
	}); 
	return Seat;
});
