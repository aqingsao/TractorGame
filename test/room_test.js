var requirejs = require('requirejs');
requirejs.config({
	baseUrl: 'public/javascripts', 
	nodeRequire: require
}); 
 
requirejs(['app/room', 'app/player', 'app/roomState', 'app/seats', 'app/pair', 'app/rank', 'app/seat', 'app/card', 'app/rooms', 'underscore', 'app/cards'], function(Room, Player, RoomState, Seats, Pair, Rank, Seat, Card, Rooms, _, Cards){  
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

		test.throws(function(){room.join(jacky, 1)}, "Cannot take seat as player already take seat");

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
		test.equals(room.get('roomState'), RoomState.READY);
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
	exports['Room should be ready when 4 players join'] = function(test){
		test.equals(readyGame().get('roomState'), RoomState.READY);

		test.done();
	};

	exports['Room can start and deal cards when ready'] = function(test){
		var room = readyGame();

		room.start();
		test.equals(room.get('roomState'), RoomState.DEALING);

		var totalTime = 0;
		var assertion = function(){
			if(room.getSeatOfPlayer(yao).get('cards').size() < 25 && totalTime < 10){
				setTimeout(assertion, 1000);
			}
			else{
				test.equals(room.getSeatOfPlayer(yao).get('cards').size(), 25);
				test.done();
			}
		}
		assertion();
	};

	exports["cannot flip cards when tractor not ready."] = function(test){
		var room = rooms.create();	
		test.throws(function(){room.flip(jacky, [smallJoker, heart2])}, "You cannot flip cards");

		test.done();
	};

	exports["Player can flip when having available jokers and trumps."] = function(test){
		var room = readyGame();
		var originalDeal = room.deal, originalDealRestToBanker = room.dealRestToBanker;
		var smallJoker = Card.smallJoker();
		var heart2 = Card.heart(Rank.TWO);
		room.deal = function(){
			stubDeal([{seat: room.getSeatOfPlayer(jacky), cards: [smallJoker, heart2]}]);
		};	
		room.dealRestToBanker = function(){};
		room.start();

		room.flip(room.getSeatOfPlayer(jacky), Cards.cards([smallJoker, heart2]));

		var seats = room.get('seats');
		test.equals(seats.at(0).get('rank'), Rank.TWO);
		test.equals(room.getSeatOfPlayer(jacky).get('defender'), true);
		test.equals(room.getSeatOfPlayer(kerry).get('defender'), true);
		test.equals(room.getSeatOfPlayer(nana).get('attacker'), true);
		test.equals(room.getSeatOfPlayer(yao).get('attacker'), true);

		room.deal = originalDeal;
		room.dealRestToBanker = originalDealRestToBanker;

		test.done();
	};

	exports["Player can overturn when having bigger jokers and trumps"] = function(test){
		var room = readyGame();
		var originalDeal = room.deal;
		var smallJoker = Card.smallJoker();
		var heart2 = Card.heart(Rank.TWO);
		var diamond1 = Card.diamond(Rank.TWO);
		var diamond2 = Card.diamond(Rank.TWO);
		room.deal = function(){
			stubDeal([{seat: room.getSeatOfPlayer(jacky), cards: [smallJoker, heart2]}, {seat: room.getSeatOfPlayer(yao), cards: [smallJoker, diamond1, diamond2]}]);
		};	
		room.dealRestToBanker = function(){};
		room.start();

		room.flip(room.getSeatOfPlayer(jacky), Cards.cards([smallJoker, heart2]));

		test.equals(room.getSeatOfPlayer(jacky).get("defender"), true);
		test.equals(room.getSeatOfPlayer(yao).get("attacker"), true);

		room.flip(room.getSeatOfPlayer(yao), Cards.cards([smallJoker, diamond1, diamond2]));
		test.equals(room.getSeatOfPlayer(yao).get("defender"), true);
		test.equals(room.getSeatOfPlayer(jacky).get("attacker"), true);

		room.deal = originalDeal;
		test.done();
	};
	exports["Player cannot overturn when not having bigger jokers and trumps"] = function(test){
		var room = readyGame();
		var originalDeal = room.deal;
		var smallJoker = Card.smallJoker();
		var heart2 = Card.heart(Rank.TWO);
		var diamond1 = Card.diamond(Rank.TWO);
		room.deal = function(){
			stubDeal([{seat: room.getSeatOfPlayer(jacky), cards: [smallJoker, heart2]}, {seat: room.getSeatOfPlayer(yao), cards: [smallJoker, diamond1]}]);
		};	
		room.start();

		room.flip(room.getSeatOfPlayer(jacky), Cards.cards([smallJoker, heart2]));

		test.equals(room.getSeatOfPlayer(jacky).get('defender'), true);
		test.equals(room.getSeatOfPlayer(kerry).get('defender'), true);
		test.equals(room.getSeatOfPlayer(nana).get('attacker'), true);
		test.equals(room.getSeatOfPlayer(yao).get('attacker'), true);
		
		test.throws(function(){room.flip(room.getSeatOfPlayer(yao), [smallJoker, diamond1])}, "");
		test.equals(room.getSeatOfPlayer(jacky).get('defender'), true);
		test.equals(room.getSeatOfPlayer(kerry).get('defender'), true);
		test.equals(room.getSeatOfPlayer(nana).get('attacker'), true);
		test.equals(room.getSeatOfPlayer(yao).get('attacker'), true);

		room.deal = originalDeal;
		test.done();
	};

	exports["Player cannot flip rank3 when currently playing rank 2"] = function(test){
		var room = readyGame();
		var originalDeal = room.deal;
		var smallJoker = Card.smallJoker();
		var heart3 = Card.heart(Rank.THREE);
		room.deal = function(){
			stubDeal([{seat: room.getSeatOfPlayer(jacky), cards: [smallJoker, heart3]}]);
		};	
		room.start();

		test.throws(function(){room.flip(room.getSeatOfPlayer(jacky), [smallJoker, heart3])}, "You cannot flip cards");

		room.deal = originalDeal;
		test.done();
	};

	exports["Player can flip 2 jokers when currently playing rank2"] = function(test){
		var room = readyGame();
		var originalDeal = room.deal;
		var smallJoker1 = Card.smallJoker();
		var smallJoker2 = Card.smallJoker();
		room.deal = function(){
			stubDeal([{seat: room.getSeatOfPlayer(jacky), cards: [smallJoker1, smallJoker2]}]);
		};	
		room.dealRestToBanker = function(){};
		room.start();

		room.flip(room.getSeatOfPlayer(jacky), Cards.cards([smallJoker1, smallJoker2]));

		var seats = room.get('seats');
		test.equals(seats.getSeatOfPlayer(jacky).get('defender'), true);
		test.equals(seats.getSeatOfPlayer(yao).get('attacker'), true);

		room.deal = originalDeal;
		test.done();
	};

	exports["cannot flip cards when players has no trump cards"] = function(test){
		var room = readyGame();
		var originalDeal = room.deal;
		room.deal = function(){
			stubDeal([]);
		};	
		room.dealRestToBanker = function(){};
		room.start();

		test.throws(function(){room.flip(room.getSeatOfPlayer(jacky), [smallJoker, heart3])}, "Cannot flip cards");

		room.deal = originalDeal;
		test.done();
	};

	exports["can get banker and flipper after flipping"] = function(test){
		var room = readyGame();
		var originalDeal = room.deal;
		var smallJoker1 = Card.smallJoker();
		var smallJoker2 = Card.smallJoker();
		var seat = room.getSeatOfPlayer(jacky);
		room.deal = function(){
			stubDeal([{seat: seat, cards: [smallJoker1, smallJoker2]}]);
		};	
		room.dealRestToBanker = function(){};

		room.start();

		room.flip(seat, Cards.cards([smallJoker1, smallJoker2]));

		var seats = room.get('seats');
		test.equals(room.banker(), seat);
		test.equals(room.flipper(), seat);
		test.equals(room.isBanker(seat.id), true);
		test.equals(room.isBanker(room.getSeatOfPlayer(nana).id), false);

		room.deal = originalDeal;
		test.done();
	};


	var jacky = new Player({name: 'Jacky'});
	var nana = new Player({name: 'Nana'});
	var kerry = new Player({name: 'Kerry'});
	var yao = new Player({name: 'Yao'});

	var rooms = new Rooms();
	var readyGame = function(){
		var room = rooms.create();
		room.join(jacky, 0);
		room.join(nana, 1);
		room.join(kerry, 2);
		room.join(yao, 3);

		return room;
	}
	function stubDeal(cardsForSeat){
		_.each(cardsForSeat, function(obj){
			var seat = obj.seat;
			var cards = obj.cards;                  
			seat.set({cards: Cards.cards()});
			_.each(cards, function(card){
				seat.deal(card);
			});    
		});
	}; 
});