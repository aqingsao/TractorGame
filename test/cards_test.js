var requirejs = require('requirejs');
requirejs.config({
	baseUrl: 'public/javascripts'
}); 
requirejs(['common', "app/cards", "app/rank"], function(Common, Cards, Rank){
	console.log("_________in cards test: " + Common._.isObject("roomState"));
	exports['Card equals'] = function(test){
		test.ok(Cards.heart(Rank.QUEEN).equals(Cards.heart(Rank.QUEEN)));
		test.ok(Cards.smallJoker().equals(Cards.smallJoker()));
		test.ok(Cards.club(Rank.TWO).equals(Cards.club(Rank.TWO)));

		test.ok(!Cards.smallJoker().equals(Cards.bigJoker()));
		test.ok(!Cards.club(Rank.TWO).equals(Cards.club(Rank.THREE)));

		test.done();
	};

	exports["Card isSmallJoker or isBigJoker or isRedSuit or isBlackSuit"] = function(test){
		test.ok(Cards.heart(Rank.JACK).isRedSuit());
		test.ok(!Cards.heart(Rank.JACK).isBlackSuit());
		test.ok(!Cards.heart(Rank.JACK).isSmallJoker());

		test.ok(Cards.smallJoker().isSmallJoker());
		test.ok(!Cards.heart(Rank.JACK).isSmallJoker());
		test.ok(!Cards.bigJoker().isSmallJoker());

		test.ok(!Cards.smallJoker().isBigJoker());
		test.ok(!Cards.heart(Rank.JACK).isBigJoker());
		test.ok(Cards.bigJoker(Rank.JACK).isBigJoker());

		test.done();
	};

	exports["show have suit name and rank name"] = function(test){
		var heart2 = Cards.heart(Rank.TWO);
		test.equals(heart2.suit.get('name'), 'HEART');
		test.equals(heart2.rank.get('name'), '2'); 
		test.done();
	};	
	
	exports['0 decks'] = function(test){
		test.equal(Cards.decks(0).length, 0);
		test.done();
	};

	exports['1 deck has 54 cards'] = function(test){
		var cards = Cards.decks(1); 
		test.equal(cards.length, 54);
		test.ok(cards.contains(Cards.smallJoker()));
		test.ok(cards.contains(Cards.bigJoker()));
		test.ok(cards.contains(Cards.heart(Rank.QUEEN)));
		test.done();
	};
	exports['2 deck2 has 108 cards'] = function(test){
		var cards = Cards.decks(2);
		test.equal(cards.length, 108);
		test.done();
	};

	exports['allSuits return true when cards is emtpy'] = function(test){
		var cards = Cards.cards();
		test.ok(cards.allSuits());
		test.done();
	};
	exports['allSuits return true when cards are all suits'] = function(test){
		var cards = Cards.cards([Cards.heart(Rank.TWO), Cards.club(Rank.THREE)]);
		test.ok(cards.allSuits());
		test.done();
	};
	exports['allSuits return false when at least one card is not suit'] = function(test){
		var cards = Cards.cards([Cards.smallJoker(), Cards.club(Rank.THREE)]);
		test.ok(!cards.allSuits());
		test.done();
	};
	exports['allJokers return true when cards are all jokers'] = function(test){
		var cards = Cards.cards([Cards.smallJoker(), Cards.bigJoker()]);
		test.ok(cards.allJokers());
		test.done();
	};
	exports['allJokers return false when at least one is not jokers'] = function(test){
		var cards = Cards.cards([Cards.heart(Rank.TWO), Cards.bigJoker()]);
		test.ok(!cards.allJokers());
		test.done();
	};
	exports["sameSuits return true when cards with size 0"] = function(test){
		var cards = Cards.cards([]);
		test.ok(cards.sameSuit());
		test.done();
	};
	exports["sameSuits return true when cards with size 1"] = function(test){
		var cards = Cards.cards([Cards.club(Rank.THREE)]);
		test.ok(cards.sameSuit());
		test.done();
	};
	exports["sameSuits return true when 2 cards have same suit"] = function(test){
		var cards = Cards.cards([Cards.club(Rank.THREE), Cards.club(Rank.FOUR)]);
		test.ok(cards.sameSuit());
		test.done();
	};
	exports["sameSuits return false when 2 cards have not same suit"] = function(test){
		var cards = Cards.cards([Cards.club(Rank.THREE), Cards.spade(Rank.FOUR)]);
		test.ok(!cards.sameSuit());
		test.done();
	};

	exports["could create several cards"] = function(test){
		var cards = Cards.cards(Cards.club(Rank.TWO));
		test.equals(cards.length, 1);
		test.done();
	};

	exports["Can flip when having 2 big jokers"] = function(test){
		var cards = Cards.cards([Cards.bigJoker(), Cards.bigJoker()]);
		test.equals(cards.canFlip(), true);
		test.done();
	};

	exports["Can flip when having 2 small jokers"] = function(test){
		var cards = Cards.cards([Cards.smallJoker(), Cards.smallJoker()]);
		test.equals(cards.canFlip(), true);
		test.done();
	};
	exports["Can flip when having 1 small joker and 1 heart"] = function(test){
		var cards = Cards.cards([Cards.smallJoker(), Cards.heart(Rank.TWO)]);
		test.equals(cards.canFlip(), true);
		test.done();
	};
});
