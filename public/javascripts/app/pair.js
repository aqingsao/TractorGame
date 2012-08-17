define(['common'], function(Common){
	var Pair = Common.Backbone.Model.extend({
		initialize: function(name, seat0, seat1){
			this.name = name;
			this.seats = new Common.Backbone.Collection();
			this.seats.add(seat0);
			this.seats.add(seat1);
			this.isDefenders = false;
			this.isAttackers = false;
		}, 
		hasPlayer: function(player){
			return this.seats.any(function(seat){
				return seat.player.equals(player);
			});
		}, 
		setDefender: function(isDefenders){
			this.isDefenders = isDefenders;
			this.isAttackers = !isDefenders;
		}, 
		rank: function(){
			return this.seats.at(0).rank;
		}
	});
	return Pair;
});
