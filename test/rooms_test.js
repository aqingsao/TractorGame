var requirejs = require('requirejs');
requirejs.config({
	baseUrl: 'public/javascripts', 
	nodeRequire: require
}); 
 
requirejs(['backbone', 'app/rooms', 'app/room'], function(Backbone, Rooms, Room){  
	exports['rooms length is 0'] = function(test){
		var rooms = new Rooms();
		test.equals(rooms.length, 0);
		
		test.done();
	};
	exports['can get room by id'] = function(test){
		var rooms = new Rooms();
		var room = new Backbone.Model({id: 1});
		room.id = 1;
		test.equals(room.id, 1);
		rooms.add(room);

		test.ok(rooms.get(1) != undefined);
		test.done();
	}
});