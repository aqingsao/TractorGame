var requirejs = require('requirejs');
requirejs.config({
	baseUrl: 'public/javascripts'
}); 
requirejs(["app/player", "app/cards", "app/card", "app/rank"], function(Player, Cards, Card, Rank){
	exports['Player has 1 card'] = function(test){ 
		var heart2 = Card.heart(Rank.TWO); 
		var player = new Player({name: "Jacky"}); 
		player.deal(heart2);
		
		test.ok(player.hasCards(Cards.cards(heart2)));

		test.done();
	};
	exports['Player has no 1 card'] = function(test){ 
		var heart2 = Card.heart(Rank.TWO); 
		var player = new Player({name: "Jacky"}); 
		
		test.ok(!player.hasCards(Cards.cards(heart2)));

		test.done();
	};
	exports['Player has 2 cards'] = function(test){ 
		var heart2 = Card.heart(Rank.TWO); 
		var club3 = Card.club(Rank.THREE); 
		var player = new Player({name: "Jacky"}); 
		player.deal(heart2);
		player.deal(club3);
				
		test.ok(player.hasCards(Cards.cards([heart2, club3])));

		test.done();
	};
	exports['Player has no 2 cards'] = function(test){ 
		var heart2 = Card.heart(Rank.TWO); 
		var club3 = Card.club(Rank.THREE); 
		var player = new Player({name: "Jacky"}); 
		player.deal(heart2);
				
		test.ok(!player.hasCards(Cards.cards([heart2, club3])));

		test.done();
	};
})