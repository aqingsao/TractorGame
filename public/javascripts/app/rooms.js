define(['backbone', 'underscore', 'app/cards', 'app/seats', 'app/round', 'app/room'], function(Backbone, _, Cards, Seats, Round, Room){     
	var Rooms = Backbone.Collection.extend({ 
		initialize: function(){
			this.dealInterval = 100;
		},
		create: function(){  
			var count = this.size();
			var room = new Room({id: count + 1, dealInterval: this.dealInterval});
			this.add(room);                                  
			return room;
		}
	});
	return Rooms;
});
