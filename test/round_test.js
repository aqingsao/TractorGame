var requirejs = require('requirejs');
requirejs.config({
	baseUrl: 'public/javascripts', 
	nodeRequire: require
}); 
requirejs(['common', "app/cards", "app/player", "app/round", "app/rooms", "app/rank"], function(Common, Cards, Player, Round, Rooms, Rank){
	exports['Tractor round should be ready when 4 players join'] = function(test){
		var tractorRound = readyGame().tractorRound;
		test.equals(tractorRound.state, Round.RoundState.READY);

		test.done();
	};

	exports['Tractor round can start and deal cards when ready'] = function(test){
		var tractorRound = readyGame().tractorRound;
		test.equals(tractorRound.state, Round.RoundState.READY);

		tractorRound.start();
		test.equals(tractorRound.state, Round.RoundState.DEALING);

		var totalTime = 0;
		var assertion = function(){
			if(yao.get('cards').size() < 25 && totalTime < 10){
				setTimeout(assertion, 1000);
			}
			else{
				test.equals(yao.get('cards').size(), 25);
				test.done();
			}
		}
		assertion();
	};

	exports["Non team is defender at startup"] = function(test){
		var room = readyGame();
		var seats = room.get('seats');
		test.equals(seats.pairs.size(), 2);
		test.equals(seats.pairs.at(0).rank(), Rank.TWO);
		test.equals(seats.pairs.at(1).rank(), Rank.TWO);
		test.ok(seats.defenders() == undefined);
		test.ok(seats.attackers() == undefined);

		test.done();
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
		var smallJoker = Cards.smallJoker();
		var heart2 = Cards.heart(Rank.TWO);
		tractorRound.deal = function(){
			stubDeal([{player: jacky, cards: Cards.cards(smallJoker, heart2)}]);
		};	
		tractorRound.start();

		room.flip(jacky, Cards.cards([smallJoker, heart2]));

		var seats = room.get('seats');
		test.equals(seats.pairs.at(0).rank(), Rank.TWO);
		test.ok(seats.defenders() != undefined);
		test.equals(seats.defenders().hasPlayer(jacky), true);
		test.equals(seats.defenders().hasPlayer(kerry), true);
		test.ok(seats.attackers() != undefined);
		test.equals(seats.attackers().hasPlayer(nana), true);
		test.equals(seats.attackers().hasPlayer(yao), true);

		tractorRound.deal = originalDeal;
		test.done();
	};

	exports["Player can overturn when having bigger jokers and trumps"] = function(test){
		var room = readyGame();
		var tractorRound = room.tractorRound;
		var originalDeal = tractorRound.deal;
		var smallJoker = Cards.smallJoker();
		var heart2 = Cards.heart(Rank.TWO);
		var diamond1 = Cards.diamond(Rank.TWO);
		var diamond2 = Cards.diamond(Rank.TWO);
		tractorRound.deal = function(){
			stubDeal([{player: jacky, cards: Cards.cards(smallJoker, heart2)}, {player: yao, cards: Cards.cards(smallJoker, diamond1, diamond2)}]);
		};	
		tractorRound.start();

		room.flip(jacky, Cards.cards([smallJoker, heart2]));

		var seats = room.get('seats');
		test.equals(seats.defenders().hasPlayer(jacky), true);
		test.equals(seats.attackers().hasPlayer(yao), true);

		room.flip(yao, Cards.cards([smallJoker, diamond1, diamond2]));
		test.equals(seats.defenders().hasPlayer(yao), true);
		test.equals(seats.attackers().hasPlayer(jacky), true);

		tractorRound.deal = originalDeal;
		test.done();
	};
	exports["Player cannot overturn when not having bigger jokers and trumps"] = function(test){
		var room = readyGame();
		var tractorRound = room.tractorRound;
		var originalDeal = tractorRound.deal;
		var smallJoker = Cards.smallJoker();
		var heart2 = Cards.heart(Rank.TWO);
		var diamond1 = Cards.diamond(Rank.TWO);
		tractorRound.deal = function(){
			stubDeal([{player: jacky, cards: Cards.cards(smallJoker, heart2)}, {player: yao, cards: Cards.cards(smallJoker, diamond1)}]);
		};	
		tractorRound.start();

		room.flip(jacky, Cards.cards([smallJoker, heart2]));

		var seats = room.get('seats');
		test.equals(seats.defenders().hasPlayer(jacky), true);
		test.equals(seats.attackers().hasPlayer(yao), true);

		test.throws(function(){room.flip(yao, [smallJoker, diamond1])}, "");
		test.equals(seats.defenders().hasPlayer(jacky), true);
		test.equals(seats.attackers().hasPlayer(yao), true);

		tractorRound.deal = originalDeal;
		test.done();
	};

	exports["Player cannot flip rank3 when currently playing rank 2"] = function(test){
		var room = readyGame();
		var tractorRound = room.tractorRound;
		var originalDeal = tractorRound.deal;
		var smallJoker = Cards.smallJoker();
		var heart3 = Cards.heart(Rank.THREE);
		tractorRound.deal = function(){
			stubDeal([{player: jacky, cards: Cards.cards(smallJoker, heart3)}]);
		};	
		tractorRound.start();

		test.throws(function(){room.flip(jacky, [smallJoker, heart3])}, "You cannot flip cards");

		tractorRound.deal = originalDeal;
		test.done();
	};

	exports["Player can flip 2 jokers when currently playing rank2"] = function(test){
		var room = readyGame();
		var tractorRound = room.tractorRound;
		var originalDeal = tractorRound.deal;
		var smallJoker1 = Cards.smallJoker();
		var smallJoker2 = Cards.smallJoker();
		tractorRound.deal = function(){
			stubDeal([{player: jacky, cards: Cards.cards(smallJoker1, smallJoker2)}]);
		};	
		tractorRound.start();

		room.flip(jacky, Cards.cards([smallJoker1, smallJoker2]));

		var seats = room.get('seats');
		test.equals(seats.defenders().hasPlayer(jacky), true);
		// test.equals(seats.attackers().hasPlayer(yao), true);
			// 
		// tractorRound.deal = originalDeal;
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

		test.throws(function(){room.flip(jacky, [smallJoker, heart3])}, "Cannot flip cards");

		tractorRound.deal = originalDeal;
		test.done();
	};

	exports["Player could sort card by suit"] = function(test){  
		var jacky = new Player({name: 'Jacky'});
	    jacky.deal(Cards.smallJoker());
		jacky.deal(Cards.heart(Rank.TWO));
		var cards = jacky.sortedCards();
		test.equals(cards.length, 2);  
		test.ok(cards[1].equals(Cards.smallJoker()));
		test.ok(cards[0].equals(Cards.heart(Rank.TWO)));
		test.done();
	}

	var jacky = new Player({name: 'Jacky'});
	var nana = new Player({name: 'Nana'});
	var kerry = new Player({name: 'Kerry'});
	var yao = new Player({name: 'Yao'});

	function stubDeal(cardsForPlayer){
		Common._.each(cardsForPlayer, function(obj){
			var player = obj.player;
			var cards = obj.cards;
			cards.each(function(card){
				player.deal(card);
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
