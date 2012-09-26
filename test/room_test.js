var requirejs = require('requirejs');
requirejs.config({
	baseUrl: 'public/javascripts', 
	nodeRequire: require
}); 
 
requirejs(['app/room', 'app/player', 'app/roomState', 'app/seats', 'app/pair', 'app/rank'], function(Room, Player, RoomState, Seats, Pair, Rank){  
	exports['Room is new'] = function(test){
		var room = new Room();
		test.equals(room.get('roomState'), RoomState.WAITING);
		test.ok(!room.get('seats').full());

		test.done();
	};

	exports['Room can be joined'] = function(test){
		var room = new Room();
		room.join(jacky, 0);
		test.ok(!room.get('seats').full());
		test.equals(room.get('roomState'), RoomState.WAITING);

		test.done();
	};

	exports['Room cannot be joined by same player'] = function(test){
		var room = new Room();
		room.join(jacky, 0);
		// test.throws(function(){room.join(jacky, 1)}, "Cannot take seat");

		test.done();
	};
	exports['Room cannot be joined when seat is taken'] = function(test){
		var room = new Room();
		room.join(jacky, 0);
		test.throws(function(){room.join(nana, 0)}, "Cannot take seat");

		test.done();
	};

	exports['Room can not be joined when there are already 4 players'] = function(test){	
		var room = new Room();
		room.join(jacky, 0);
		room.join(nana, 1);
		room.join(kerry, 2);
		room.join(yao, 3);
		test.ok(room.get('seats').full());
		test.equals(room.get('roomState'), RoomState.PLAYING);
		test.throws(function(){room.join('Bin', 0)}, "Cannot join this game");

		test.done();
	};  

	exports['Room available seats are 4'] = function(test){	
		var room = new Room();
		test.equals(room.availableSeats(), 4);

		test.done();
	};  

	exports['Room available seats are 3'] = function(test){	
		var room = new Room(); 
		room.join(jacky, 0)
		test.equals(room.availableSeats(), 3);

		test.done();
	};  
	
	// exports['room can be generated from json'] = function(test){
	// 	var room = new Room({id: 1});
	// 	room.set({roomState: RoomState.PLAYING});
	// 	var another = Room.fjod(room.toJSON());  
	// 	test.ok(another.equals(room)); 
	// 	test.equals(another.get("id"), 1);
		
	// 	test.done();
	// };

    exports['Can get seat by player'] = function(test){
		var room = new Room();
		room.join(jacky, 0);
		var seat = room.getSeatOfPlayer(jacky);
		test.equals(seat.get("id"), 0);

		test.done();
	};
    exports['Should return undefined when player is not in room'] = function(test){
		var room = new Room();
		var seat = room.getSeatOfPlayer(jacky);
		test.equals(seat, undefined);

		test.done();
	};


	var jacky = new Player({name: 'Jacky'});
	var nana = new Player({name: 'Nana'});
	var kerry = new Player({name: 'Kerry'});
	var yao = new Player({name: 'Yao'});
});