var requirejs = require('requirejs');
requirejs.config({
	baseUrl: 'public/javascripts', 
	nodeRequire: require
}); 
 
requirejs(['app/card', 'app/rank'], function(Card, Rank){ 
	exports['Card equals'] = function(test){
		test.ok(Card.heart(Rank.QUEEN).equals(Card.heart(Rank.QUEEN)));
		test.ok(Card.smallJoker().equals(Card.smallJoker()));
		test.ok(Card.club(Rank.TWO).equals(Card.club(Rank.TWO)));

		test.ok(!Card.smallJoker().equals(Card.bigJoker()));
		test.ok(!Card.club(Rank.TWO).equals(Card.club(Rank.THREE)));

		test.done();
	};

	exports["Card isSmallJoker or isBigJoker or isRedSuit or isBlackSuit"] = function(test){
		test.ok(Card.heart(Rank.JACK).isRedSuit());
		test.ok(!Card.heart(Rank.JACK).isBlackSuit());
		test.ok(!Card.heart(Rank.JACK).isSmallJoker());

		test.ok(Card.smallJoker().isSmallJoker());
		test.ok(!Card.heart(Rank.JACK).isSmallJoker());
		test.ok(!Card.bigJoker().isSmallJoker());

		test.ok(!Card.smallJoker().isBigJoker());
		test.ok(!Card.heart(Rank.JACK).isBigJoker());
		test.ok(Card.bigJoker(Rank.JACK).isBigJoker());

		test.done();
	};

	exports["show have suit name and rank name"] = function(test){
		var heart2 = Card.heart(Rank.TWO);
		test.equals(heart2.get('suit').get('name'), 'HEART');
		test.equals(heart2.get('rank').get('name'), '2'); 
		test.done();
	};	
});