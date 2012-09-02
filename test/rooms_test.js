var requirejs = require('requirejs');
requirejs.config({
	baseUrl: 'public/javascripts', 
	nodeRequire: require
}); 
 
requirejs(['app/rooms'], function(Rooms){  
	exports['rooms length is 0'] = function(test){
		var rooms = new Rooms();
		test.equals(rooms.length, 0);
		
		test.done();
	};
});