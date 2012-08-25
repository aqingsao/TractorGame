var requirejs = require('requirejs');
requirejs.config({
	baseUrl: 'public/javascripts', 
	nodeRequire: require
}); 
 
requirejs(['app/rooms', 'app/player'], function(Rooms, Player){  
	var rooms = new Rooms();
	exports['Room is new'] = function(test){
		var room = rooms.create();
		test.equals(room.get('roomState'), Rooms.RoomState.WAITING);
		test.ok(!room.get('seats').full());

		test.done();
	};

	exports['Room can be joined'] = function(test){
		var room = rooms.create();
		room.join(jacky, 0);
		test.ok(!room.get('seats').full());
		test.equals(room.get('roomState'), Rooms.RoomState.WAITING);

		test.done();
	};

	exports['Room cannot be joined by same player'] = function(test){
		var room = rooms.create();  
		room.join(jacky, 0);
		// test.throws(function(){room.join(jacky, 1)}, "Cannot take seat");

		test.done();
	};
	exports['Room cannot be joined when seat is taken'] = function(test){
		var room = rooms.create();
		room.join(jacky, 0);
		test.throws(function(){room.join(nana, 0)}, "Cannot take seat");

		test.done();
	};

	exports['Room can not be joined when there are already 4 players'] = function(test){	
		var room = rooms.create();
		room.join(jacky, 0);
		room.join(nana, 1);
		room.join(kerry, 2);
		room.join(yao, 3);
		test.ok(room.get('seats').full());
		test.equals(room.get('roomState'), Rooms.RoomState.PLAYING);
		test.throws(function(){room.join('Bin', 0)}, "Cannot join this game");

		test.done();
	};

	var jacky = new Player({name: 'Jacky'});
	var nana = new Player({name: 'Nana'});
	var kerry = new Player({name: 'Kerry'});
	var yao = new Player({name: 'Yao'});
});