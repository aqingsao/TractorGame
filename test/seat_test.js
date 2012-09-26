var requirejs = require('requirejs');
requirejs.config({
	baseUrl: 'public/javascripts', 
	nodeRequire: require
}); 
 
requirejs(['app/seat', 'app/rank', 'app/player', 'app/card', 'app/cards'], function(Seat, Rank, Player, Card, Cards){  
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
});