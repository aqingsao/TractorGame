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
	exports['check when card is correct'] = function(test){
		test.equals(Card.smallJoker().isJoker(), true);
		test.equals(Card.bigJoker().isJoker(), true);

		test.equals(Card.heart(Rank.TWO).isHeart(), true);
		test.equals(Card.heart(Rank.TWO).isJoker(), false);
		
		test.equals(Card.spade(Rank.TWO).isSpade(), true);
		test.equals(Card.spade(Rank.TWO).isHeart(), false);
		
		test.equals(Card.club(Rank.TWO).isClub(), true);
		test.equals(Card.club(Rank.TWO).isSpade(), false);

		test.equals(Card.diamond(Rank.TWO).isDiamond(), true);
		test.equals(Card.diamond(Rank.TWO).isClub(), false);

		test.done();
	};
	exports["return true when card match"] = function(test){
		var heart2 = Card.heart(Rank.TWO);
		test.equals(heart2.match({rank: Rank.TWO, suit: heart2.get('suit').get('name')}), true);
		test.done();
	};	
	exports["return false when card not match"] = function(test){
		var heart2 = Card.heart(Rank.TWO);
		test.equals(heart2.match({rank: Rank.THREE, suit: heart2.get('suit').get('name')}), false);
		test.done();
	};	


});