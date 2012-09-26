var requirejs = require('requirejs');
requirejs.config({
	baseUrl: 'public/javascripts', 
	nodeRequire: require
}); 
requirejs(["app/cards", "app/card", "app/player", "app/round", "app/rooms", "app/rank", "underscore", 'app/seat'], function(Cards, Card, Player, Round, Rooms, Rank, _, Seat){
	exports['Tractor round should be ready when 4 players join'] = function(test){
		var tractorRound = readyGame().tractorRound;
		test.equals(tractorRound.state, Round.RoundState.READY);

		test.done();
	};

	exports['Tractor round can start and deal cards when ready'] = function(test){
		var room = readyGame();
		var tractorRound = room.tractorRound;
		test.equals(tractorRound.state, Round.RoundState.READY);

		tractorRound.start();
		test.equals(tractorRound.state, Round.RoundState.DEALING);

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
		var tractorRound = room.tractorRound;
		var originalDeal = tractorRound.deal;
		var smallJoker = Card.smallJoker();
		var heart2 = Card.heart(Rank.TWO);
		tractorRound.deal = function(){
			stubDeal([{seat: room.getSeatOfPlayer(jacky), cards: [smallJoker, heart2]}]);
		};	
		tractorRound.start();

		room.flip(room.getSeatOfPlayer(jacky), Cards.cards([smallJoker, heart2]));

		var seats = room.get('seats');
		test.equals(seats.at(0).get('rank'), Rank.TWO);
		console.log("+++++++++++++++++++++");
		console.log(room.getSeatOfPlayer(jacky).get('defender'));
		console.log(room.getSeatOfPlayer(kerry).get('defender'));
		console.log(room.getSeatOfPlayer(nana).get('defender'));
		console.log(room.getSeatOfPlayer(yao).get('defender'));
		test.equals(room.getSeatOfPlayer(jacky).get('defender'), true);
		test.equals(room.getSeatOfPlayer(kerry).get('defender'), true);
		test.equals(room.getSeatOfPlayer(nana).get('attacker'), true);
		test.equals(room.getSeatOfPlayer(yao).get('attacker'), true);

		tractorRound.deal = originalDeal;
		test.done();
	};

	exports["Player can overturn when having bigger jokers and trumps"] = function(test){
		var room = readyGame();
		var tractorRound = room.tractorRound;
		var originalDeal = tractorRound.deal;
		var smallJoker = Card.smallJoker();
		var heart2 = Card.heart(Rank.TWO);
		var diamond1 = Card.diamond(Rank.TWO);
		var diamond2 = Card.diamond(Rank.TWO);
		tractorRound.deal = function(){
			stubDeal([{seat: room.getSeatOfPlayer(jacky), cards: [smallJoker, heart2]}, {seat: room.getSeatOfPlayer(yao), cards: [smallJoker, diamond1, diamond2]}]);
		};	
		tractorRound.start();

		room.flip(room.getSeatOfPlayer(jacky), Cards.cards([smallJoker, heart2]));

		test.equals(room.getSeatOfPlayer(jacky).get("defender"), true);
		test.equals(room.getSeatOfPlayer(yao).get("attacker"), true);

		room.flip(room.getSeatOfPlayer(yao), Cards.cards([smallJoker, diamond1, diamond2]));
		test.equals(room.getSeatOfPlayer(yao).get("defender"), true);
		test.equals(room.getSeatOfPlayer(jacky).get("attacker"), true);

		tractorRound.deal = originalDeal;
		test.done();
	};
	exports["Player cannot overturn when not having bigger jokers and trumps"] = function(test){
		var room = readyGame();
		var tractorRound = room.tractorRound;
		var originalDeal = tractorRound.deal;
		var smallJoker = Card.smallJoker();
		var heart2 = Card.heart(Rank.TWO);
		var diamond1 = Card.diamond(Rank.TWO);
		tractorRound.deal = function(){
			stubDeal([{seat: room.getSeatOfPlayer(jacky), cards: [smallJoker, heart2]}, {seat: room.getSeatOfPlayer(yao), cards: [smallJoker, diamond1]}]);
		};	
		tractorRound.start();

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

		tractorRound.deal = originalDeal;
		test.done();
	};

	exports["Player cannot flip rank3 when currently playing rank 2"] = function(test){
		var room = readyGame();
		var tractorRound = room.tractorRound;
		var originalDeal = tractorRound.deal;
		var smallJoker = Card.smallJoker();
		var heart3 = Card.heart(Rank.THREE);
		tractorRound.deal = function(){
			stubDeal([{seat: room.getSeatOfPlayer(jacky), cards: [smallJoker, heart3]}]);
		};	
		tractorRound.start();

		test.throws(function(){room.flip(room.getSeatOfPlayer(jacky), [smallJoker, heart3])}, "You cannot flip cards");

		tractorRound.deal = originalDeal;
		test.done();
	};

	exports["Player can flip 2 jokers when currently playing rank2"] = function(test){
		var room = readyGame();
		var tractorRound = room.tractorRound;
		var originalDeal = tractorRound.deal;
		var smallJoker1 = Card.smallJoker();
		var smallJoker2 = Card.smallJoker();
		tractorRound.deal = function(){
			stubDeal([{seat: room.getSeatOfPlayer(jacky), cards: [smallJoker1, smallJoker2]}]);
		};	
		tractorRound.start();

		room.flip(room.getSeatOfPlayer(jacky), Cards.cards([smallJoker1, smallJoker2]));

		var seats = room.get('seats');
		test.equals(seats.getSeatOfPlayer(jacky).get('defender'), true);
		test.equals(seats.getSeatOfPlayer(yao).get('attacker'), true);

		tractorRound.deal = originalDeal;
		test.done();
	};

	exports["cannot flip cards when players has no trump cards"] = function(test){
		var room = readyGame();
		var tractorRound = room.tractorRound;
		var originalDeal = tractorRound.deal;
		tractorRound.deal = function(){
			stubDeal([]);
		};	
		tractorRound.start();

		test.throws(function(){room.flip(room.getSeatOfPlayer(jacky), [smallJoker, heart3])}, "Cannot flip cards");

		tractorRound.deal = originalDeal;
		test.done();
	};

	exports["Player could sort card by suit"] = function(test){  
		var seat = new Seat();
	    seat.deal(Card.smallJoker());
		seat.deal(Card.heart(Rank.TWO));
		var cards = seat.sortedCards();
		test.equals(cards.length, 2);  
		test.ok(cards[1].equals(Card.smallJoker()));
		test.ok(cards[0].equals(Card.heart(Rank.TWO)));
		test.done();
	}

	var jacky = new Player({name: 'Jacky'});
  	var nana = new Player({name: 'Nana'});
  	var kerry = new Player({name: 'Kerry'});
  	var yao = new Player({name: 'Yao'});

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
	var rooms = new Rooms();
	function readyGame(){
		var room = rooms.create();
		room.join(jacky, 0);
		room.join(nana, 1);
		room.join(kerry, 2);
		room.join(yao, 3);

		return room;
	}
});
