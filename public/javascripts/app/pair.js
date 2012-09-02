define(['backbone', 'underscore', 'app/seat'], function(Backbone, _, Seat){
	var Pair = Backbone.Collection.extend({ 
		model: Seat,
		hasPlayer: function(player){
			return this.any(function(seat){
				return seat.player.equals(player);
			});
		}, 
		isDefender: function(){
			return this.at(0).get('defender');
		}, 
		isAttacker: function(){
			return this.at(0).get('attacker');
		}, 
		rank: function(){
			return this.at(0).get('rank');
		}
	});
	return Pair;
});