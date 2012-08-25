var requirejs = require('requirejs');
requirejs.config({
	baseUrl: 'public/javascripts'
}); 
requirejs(['common',"app/player", "app/cards", "app/rank"], function(Common, Player, Cards, Rank){
	exports['Player has 1 card'] = function(test){ 
		var heart2 = Cards.heart(Rank.TWO); 
		var player = new Player("Jacky"); 
		player.deal(heart2);
		
		test.ok(player.hasCards(heart2));

		test.done();
	};
	exports['Player has no 1 card'] = function(test){ 
		var heart2 = Cards.heart(Rank.TWO); 
		var player = new Player("Jacky"); 
		
		test.ok(!player.hasCards(heart2));

		test.done();
	};
	exports['Player has 2 cards'] = function(test){ 
		var heart2 = Cards.heart(Rank.TWO); 
		var club3 = Cards.club(Rank.THREE); 
		var player = new Player("Jacky"); 
		player.deal(heart2);
		player.deal(club3);
				
		test.ok(player.hasCards([heart2, club3]));

		test.done();
	};
	exports['Player has no 2 cards'] = function(test){ 
		var heart2 = Cards.heart(Rank.TWO); 
		var club3 = Cards.club(Rank.THREE); 
		var player = new Player("Jacky"); 
		player.deal(heart2);
				
		test.ok(!player.hasCards([heart2, club3]));

		test.done();
	};
})