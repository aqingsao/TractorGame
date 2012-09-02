var requirejs = require('requirejs');
requirejs.config({
	baseUrl: 'public/javascripts', 
	nodeRequire: require
}); 
 
requirejs(['app/room', 'app/player'], function(Room, Player){  
	exports['Room is new'] = function(test){
		var room = new Room();    
		// console.log(room.toJSON());
		var anotherRoom = Room.fromJSON(room.toJSON());    
		// console.log(anotherRoom);
		test.equals(room.toJSON(), anotherRoom.toJSON());

		test.done();
	};
});