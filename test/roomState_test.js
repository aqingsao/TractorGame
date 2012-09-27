var requirejs = require('requirejs');
requirejs.config({
	baseUrl: 'public/javascripts', 
	nodeRequire: require
}); 
 
requirejs(['app/roomState'], function(RoomState){ 
	exports['Get roomState from json'] = function(test){
		test.ok(RoomState.fjod({name: 'Done'}), RoomState.DONE);
		test.ok(RoomState.fjod({name: 'Waiting'}), RoomState.WAITING);
		test.ok(RoomState.fjod({name: 'Playing'}), RoomState.PLAYING);

		test.done();
	};
	exports['throw exception when given invalid name'] = function(test){
		test.throws(function(){RoomState.fjod({name: 'invalid name'})}, '');

		test.done();
	};

});