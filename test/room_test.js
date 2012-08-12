var Room = require('../public/javascripts/room.js').Room, 
Player = require('../public/javascripts/player.js').Player, 
Round = require('../public/javascripts/tractor.js').Round,
Card = require('../public/javascripts/card.js').Card;

exports['Room is new'] = function(test){
	var room = new Room(1);
	test.equals(room.gameState, Room.RoomState.WAITING);
	test.ok(!room.seats.full());

	test.done();
};

exports['Room can be joined'] = function(test){
	var room = new Room(1);
	room.join(jacky, 0);
	test.ok(!room.seats.full());
	test.equals(room.gameState, Room.RoomState.WAITING);

	test.done();
};

exports['Room cannot be joined by same player'] = function(test){
	var room = new Room(1);
	room.join(jacky, 0);
	test.throws(function(){room.join(jacky, 1)}, "Cannot take seat");

	test.done();
};
exports['Room cannot be joined when seat is taken'] = function(test){
	var room = new Room(1);
	room.join(jacky, 0);
	test.throws(function(){room.join(nana, 0)}, "Cannot take seat");

	test.done();
};

exports['Room can not be joined when there are already 4 players'] = function(test){	
	var room = new Room(1);
	room.join(jacky, 0);
	room.join(nana, 1);
	room.join(kerry, 2);
	room.join(yao, 3);
	test.ok(room.seats.full());
	test.equals(room.gameState, Room.RoomState.PLAYING);
	test.throws(function(){room.join('Bin', 0)}, "Cannot join this game");
	
	test.done();
};
  
var jacky = new Player({name: 'Jacky'});
var nana = new Player({name: 'Nana'});
var kerry = new Player({name: 'Kerry'});
var yao = new Player({name: 'Yao'});
