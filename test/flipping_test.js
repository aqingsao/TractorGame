var requirejs = require('requirejs');
requirejs.config({
	baseUrl: 'public/javascripts', 
	nodeRequire: require
}); 
requirejs(['underscore', "app/cards", "app/card", "app/flipping", "app/player", "app/rank"], function(_, Cards, Card, Flipping, Player, Rank){
	exports['Cannot flip when jokers size is 0'] = function(test){
		var flipping = new Flipping({defender: jacky, currentRank: Rank.TWO});
		test.ok(!flipping.flip(Cards.cards()));

		test.done();
	};
	exports['Cannot flip when only has 1 joker and no suits'] = function(test){
		var flipping = new Flipping({defender: jacky, currentRank: Rank.TWO});
		test.ok(!flipping.flip(Cards.cards([Card.smallJoker()])));

		test.done();
	};
	exports['Cannot flip and have 1 joker and 3 or more spades'] = function(test){
		var flipping = new Flipping({defender: jacky, currentRank: Rank.TWO});
		test.ok(!flipping.flip(Cards.cards([Card.bigJoker(), Card.spade(Rank.TWO), Card.spade(Rank.THREE), Card.spade(Rank.TWO)])));

		test.done();
	};

	exports['Cannot flip when only has 1 small joker and 1 club'] = function(test){
		var flipping = new Flipping({defender: jacky, currentRank: Rank.TWO});
		test.ok(!flipping.flip(Cards.cards([Card.smallJoker(), Card.club(Rank.TWO)])));

		test.done();
	};
	exports['Cannot flip when only has 1 big joker and 1 heart'] = function(test){
		var flipping = new Flipping({defender: jacky, currentRank: Rank.TWO});
		test.ok(!flipping.flip(Cards.cards([Card.bigJoker(), Card.heart(Rank.TWO)])));

		test.done();
	};
	exports['Can flip and have level 1 when only has 1 big joker and 1 spade'] = function(test){
		var flipping = new Flipping({defender: jacky, currentRank: Rank.TWO});
		test.ok(flipping.flip(Cards.cards([Card.bigJoker(), Card.spade(Rank.TWO)])));
		test.equals(flipping.level, 1)
		test.done();
	};
	exports['Can flip and have level 1 when only has 1 small joker and 1 heart'] = function(test){
		var flipping = new Flipping({defender: jacky, currentRank: Rank.TWO});
		test.ok(flipping.flip(Cards.cards([Card.smallJoker(), Card.heart(Rank.TWO)])));
		test.equals(flipping.level, 1);

		test.done();
	};
	exports['Cannot flip when has 1 small joker and 1 heart and 1 club'] = function(test){
		var flipping = new Flipping({defender: jacky, currentRank: Rank.TWO});
		test.ok(!flipping.flip(Cards.cards([Card.smallJoker(), Card.heart(Rank.TWO), Card.club(Rank.TWO)])));

		test.done();
	};
	exports['Cannot flip when has 1 small joker and 1 heart TWO and 1 heart THREE'] = function(test){
		var flipping = new Flipping({defender: jacky, currentRank: Rank.TWO});
		test.ok(!flipping.flip(Cards.cards([Card.smallJoker(), Card.heart(Rank.TWO), Card.heart(Rank.THREE)])));

		test.done();
	};
	exports['Cannot flip when has 1 small joker and 2 clubs TWO'] = function(test){
		var flipping = new Flipping({defender: jacky, currentRank: Rank.TWO});
		test.ok(!flipping.flip(Cards.cards([Card.smallJoker(), Card.club(Rank.TWO), Card.club(Rank.TWO)])));

		test.done();
	};
	exports['Cannot flip when has 1 big joker and 2 diamonds TWO'] = function(test){
		var flipping = new Flipping({defender: jacky, currentRank: Rank.TWO});
		test.ok(!flipping.flip(Cards.cards([Card.bigJoker(), Card.diamond(Rank.TWO), Card.diamond(Rank.TWO)])));

		test.done();
	};
	exports['Can flip and have level 2 when has 1 big joker and 2 spades TWO'] = function(test){
		var flipping = new Flipping({defender: jacky, currentRank: Rank.TWO});
		test.ok(flipping.flip(Cards.cards([Card.bigJoker(), Card.spade(Rank.TWO), Card.spade(Rank.TWO)])));
		test.equals(flipping.level, 2);

		test.done();
	};
	exports['Cannot flip when 1 small joker and 1 big joker'] = function(test){
		var flipping = new Flipping({defender: jacky, currentRank: Rank.TWO});
		test.ok(!flipping.flip(Cards.cards([Card.bigJoker(), Card.smallJoker()])));

		test.done();
	};
	exports['Cannot flip when have 2 small jokers and 1 suit'] = function(test){
		var flipping = new Flipping({defender: jacky, currentRank: Rank.TWO});
		test.ok(!flipping.flip(Cards.cards([Card.bigJoker(), Card.smallJoker(), Card.spade(Rank.TWO)])));

		test.done();
	};
	exports['Can flip and have level 5 when have 2 small jokers only'] = function(test){
		var flipping = new Flipping({defender: jacky, currentRank: Rank.TWO});
		test.ok(flipping.flip(Cards.cards([Card.smallJoker(), Card.smallJoker()])));
		test.equals(flipping.level, 5);

		test.done();
	};
	exports['Can flip and have level 10 when have 2 big jokers only'] = function(test){
		var flipping = new Flipping({defender: jacky, currentRank: Rank.TWO});
		test.ok(flipping.flip(Cards.cards([Card.bigJoker(), Card.bigJoker()])));
		test.equals(flipping.level, 10);

		test.done();
	};

	var jacky = new Player({name: 'Jacky'});
  	var nana = new Player({name: 'Nana'});
  	var kerry = new Player({name: 'Kerry'});
  	var yao = new Player({name: 'Yao'});
});