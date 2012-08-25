var requirejs = require('requirejs');
requirejs.config({
	baseUrl: 'public/javascripts', 
	nodeRequire: require
}); 
requirejs(['common', "app/cards", "app/flipping", "app/player", "app/rank"], function(Common, Cards, Flipping, Player, Rank){
	console.log("_________in flipping test: " + Common._.isObject("roomState"));
	exports['Cannot flip when jokers size is 0'] = function(test){
		var flipping = new Flipping(jacky, Cards.cards());
		test.ok(!flipping.isValid());

		test.done();
	};
	exports['Cannot flip when only has 1 joker and no suits'] = function(test){
		var flipping = new Flipping(jacky, Cards.cards([Cards.smallJoker()]));
		test.ok(!flipping.isValid());

		test.done();
	};
	exports['Cannot flip and have 1 joker and 3 or more spades'] = function(test){
		var flipping = new Flipping(jacky, Cards.cards([Cards.bigJoker(), Cards.spade(Rank.TWO), Cards.spade(Rank.THREE), Cards.spade(Rank.TWO)]));
		test.ok(!flipping.isValid());

		test.done();
	};

	exports['Cannot flip when only has 1 small joker and 1 club'] = function(test){
		var flipping = new Flipping(jacky, Cards.cards([Cards.smallJoker(), Cards.club(Rank.TWO)]));
		test.ok(!flipping.isValid());

		test.done();
	};
	exports['Cannot flip when only has 1 big joker and 1 heart'] = function(test){
		var flipping = new Flipping(jacky, Cards.cards([Cards.bigJoker(), Cards.heart(Rank.TWO)]));
		test.ok(!flipping.isValid());

		test.done();
	};
	exports['Can flip and have level 1 when only has 1 big joker and 1 spade'] = function(test){
		var flipping = new Flipping(jacky, Cards.cards([Cards.bigJoker(), Cards.spade(Rank.TWO)]));
		test.ok(flipping.isValid());
		test.equals(flipping.level, 1)
		test.done();
	};
	exports['Can flip and have level 1 when only has 1 small joker and 1 heart'] = function(test){
		var flipping = new Flipping(jacky, Cards.cards([Cards.smallJoker(), Cards.heart(Rank.TWO)]));
		test.ok(flipping.isValid());
		test.equals(flipping.level, 1);

		test.done();
	};
	exports['Cannot flip when has 1 small joker and 1 heart and 1 club'] = function(test){
		var flipping = new Flipping(jacky, Cards.cards([Cards.smallJoker(), Cards.heart(Rank.TWO), Cards.club(Rank.TWO)]));
		test.ok(!flipping.isValid());

		test.done();
	};
	exports['Cannot flip when has 1 small joker and 1 heart TWO and 1 heart THREE'] = function(test){
		var flipping = new Flipping(jacky, Cards.cards([Cards.smallJoker(), Cards.heart(Rank.TWO), Cards.heart(Rank.THREE)]));
		test.ok(!flipping.isValid());

		test.done();
	};
	exports['Cannot flip when has 1 small joker and 2 clubs TWO'] = function(test){
		var flipping = new Flipping(jacky, Cards.cards([Cards.smallJoker(), Cards.club(Rank.TWO), Cards.club(Rank.TWO)]));
		test.ok(!flipping.isValid());

		test.done();
	};
	exports['Cannot flip when has 1 big joker and 2 diamonds TWO'] = function(test){
		var flipping = new Flipping(jacky, Cards.cards([Cards.bigJoker(), Cards.diamond(Rank.TWO), Cards.diamond(Rank.TWO)]));
		test.ok(!flipping.isValid());

		test.done();
	};
	exports['Can flip and have level 2 when has 1 big joker and 2 spades TWO'] = function(test){
		var flipping = new Flipping(jacky, Cards.cards([Cards.bigJoker(), Cards.spade(Rank.TWO), Cards.spade(Rank.TWO)]));
		test.ok(flipping.isValid());
		test.equals(flipping.level, 2);

		test.done();
	};
	exports['Cannot flip when 1 small joker and 1 big joker'] = function(test){
		var flipping = new Flipping(jacky, Cards.cards([Cards.bigJoker(), Cards.smallJoker()]));
		test.ok(!flipping.isValid());

		test.done();
	};
	exports['Cannot flip when have 2 small jokers and 1 suit'] = function(test){
		var flipping = new Flipping(jacky, Cards.cards([Cards.bigJoker(), Cards.smallJoker(), Cards.spade(Rank.TWO)]));
		test.ok(!flipping.isValid());

		test.done();
	};
	exports['Can flip and have level 5 when have 2 small jokers only'] = function(test){
		var flipping = new Flipping(jacky, Cards.cards([Cards.smallJoker(), Cards.smallJoker()]));
		test.ok(flipping.isValid());
		test.equals(flipping.level, 5);

		test.done();
	};
	exports['Can flip and have level 10 when have 2 big jokers only'] = function(test){
		var flipping = new Flipping(jacky, Cards.cards([Cards.bigJoker(), Cards.bigJoker()]));
		test.ok(flipping.isValid());
		test.equals(flipping.level, 10);

		test.done();
	};

	var jacky = new Player('Jacky');
	var nana = new Player('Nana');
	var kerry = new Player('Kerry');
	var yao = new Player('Yao');
});