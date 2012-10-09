var requirejs = require('requirejs');
requirejs.config({
	baseUrl: 'public/javascripts', 
	nodeRequire: require
}); 
 
requirejs(['app/seat', 'app/rank', 'app/player', 'app/card', 'app/cards', 'underscore'], function(Seat, Rank, Player, Card, Cards, _){  
	exports['Seat start from rank 2'] = function(test){
		var seat = new Seat();
	
		test.equals(seat.get('rank'), Rank.TWO);
		test.done();
	};
	exports['Seat is neither attacker nor defender in default'] = function(test){
		var seat = new Seat();
	
		test.equals(seat.get('attacker'), false);
		test.equals(seat.get('defender'), false);
		test.done();
	};
	exports['Seat can be set to defender'] = function(test){
		var seat = new Seat();  
		seat.setDefender(true);
	
		test.equals(seat.get('attacker'), false);
		test.equals(seat.get('defender'), true);
		test.done();
	};
	exports['Seat is not taken in default'] = function(test){
		var seat = new Seat();  
			
		test.ok(!seat.isTaken());
		test.done();
	};
	exports['Seat can be taken by a player'] = function(test){
		var seat = new Seat();  
		seat.join(new Player());	                   
		
		test.ok(seat.isTaken());
		test.done();
	};
	exports['Seat has 1 card'] = function(test){ 
		var heart2 = Card.heart(Rank.TWO); 
		var seat = new Seat();  
		seat.deal(heart2);
		
		test.ok(seat.hasCards(Cards.cards(heart2)));

		test.done();
	};
	exports['Seat has no 1 card'] = function(test){ 
		var heart2 = Card.heart(Rank.TWO); 
		var seat = new Seat();  
		
		test.ok(!seat.hasCards(Cards.cards(heart2)));

		test.done();
	};
	exports['Seat has 2 cards'] = function(test){ 
		var heart2 = Card.heart(Rank.TWO); 
		var club3 = Card.club(Rank.THREE); 
		var seat = new Seat();  
		seat.deal(heart2);
		seat.deal(club3);
				
		test.ok(seat.hasCards(Cards.cards([heart2, club3])));

		test.done();
	};
	exports['Seat has no 2 cards'] = function(test){ 
		var heart2 = Card.heart(Rank.TWO); 
		var club3 = Card.club(Rank.THREE); 
		var seat = new Seat();  
		seat.deal(heart2);
				
		test.ok(!seat.hasCards(Cards.cards([heart2, club3])));

		test.done();
	};

	exports["Can flip when having 2 big jokers"] = function(test){
		var bigJoker1 = Card.bigJoker();
		var bigJoker2 = Card.bigJoker();
		var seat = seatWithCards([bigJoker1, bigJoker2]);
		test.equals(seat.canFlip([bigJoker1.id, bigJoker2.id], Rank.TWO), true);
		test.done();
	};
	exports["Can flip when having 1 small joker and 1 heart"] = function(test){
		var smallJoker = Card.smallJoker();
		var heart2 = Card.heart(Rank.TWO);
		var seat = seatWithCards([smallJoker, heart2]);

		test.equals(seat.canFlip([smallJoker.id, heart2.id], Rank.TWO), true);

		test.done();
	};
	exports['return false when cards rank is not correct'] = function(test){
		var smallJoker = Card.smallJoker();
		var heart2 = Card.heart(Rank.TWO);
		var seat = seatWithCards([smallJoker, heart2]);

		test.equals(seat.canFlip([smallJoker.id, heart2.id], Rank.THREE), false);

		test.done();
	};
	exports['return false when seat has no cards in hand'] = function(test){
		var bigJoker = Card.bigJoker();
		var smallJoker = Card.smallJoker();
		var heart2 = Card.heart(Rank.TWO);
		var seat = seatWithCards([bigJoker, heart2]);

		test.equals(seat.canFlip([smallJoker.id, heart2.id], Rank.TWO), false);

		test.done();
	};
	exports['return cards when given cards id'] = function(test){
		var bigJoker = Card.bigJoker();
		var heart2 = Card.heart(Rank.TWO);
		var heart3 = Card.heart(Rank.THREE);
		var seat = seatWithCards([bigJoker, heart2, heart3]);

		var cards = seat.getCards([bigJoker.id, heart2.id]);
		test.equals(cards.length, 2);

		test.done();
	};

	var seatWithCards = function(cards){
		var seat = new Seat();
		_.each(cards, function(card){
			seat.deal(card);
		})
		return seat;
	}
});