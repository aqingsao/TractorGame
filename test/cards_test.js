var requirejs = require('requirejs');
requirejs.config({
	baseUrl: 'public/javascripts'
}); 
requirejs(['backbone', "app/cards", "app/rank", "app/card"], function(Backbone, Cards, Rank, Card){	
	exports['0 decks'] = function(test){
		test.equal(Cards.decks(0).length, 0);
		test.done();
	};

	exports['1 deck has 54 cards'] = function(test){
		var cards = Cards.decks(1); 
		test.equal(cards.length, 54);
		test.ok(cards.contains(Card.smallJoker()));
		test.ok(cards.contains(Card.bigJoker()));
		test.ok(cards.contains(Card.heart(Rank.QUEEN)));
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
		var cards = Cards.cards([Card.heart(Rank.TWO), Card.club(Rank.THREE)]);
		test.ok(cards.allSuits());
		test.done();
	};
	exports['allSuits return false when at least one card is not suit'] = function(test){
		var cards = Cards.cards([Card.smallJoker(), Card.club(Rank.THREE)]);
		test.ok(!cards.allSuits());
		test.done();
	};
	exports['allJokers return true when cards are all jokers'] = function(test){
		var cards = Cards.cards([Card.smallJoker(), Card.bigJoker()]);
		test.ok(cards.allJokers());
		test.done();
	};
	exports['allJokers return false when at least one is not jokers'] = function(test){
		var cards = Cards.cards([Card.heart(Rank.TWO), Card.bigJoker()]);
		test.ok(!cards.allJokers());
		test.done();
	};
	exports["sameSuits return true when cards with size 0"] = function(test){
		var cards = Cards.cards([]);
		test.ok(cards.sameSuit());
		test.done();
	};
	exports["sameSuits return true when cards with size 1"] = function(test){
		var cards = Cards.cards([Card.club(Rank.THREE)]);
		test.ok(cards.sameSuit());
		test.done();
	};
	exports["sameSuits return true when 2 cards have same suit"] = function(test){
		var cards = Cards.cards([Card.club(Rank.THREE), Card.club(Rank.FOUR)]);
		test.ok(cards.sameSuit());
		test.done();
	};
	exports["sameSuits return false when 2 cards have not same suit"] = function(test){
		var cards = Cards.cards([Card.club(Rank.THREE), Card.spade(Rank.FOUR)]);
		test.ok(!cards.sameSuit());
		test.done();
	};

	exports["could create several cards"] = function(test){
		var cards = Cards.cards(Card.club(Rank.TWO));
		test.equals(cards.length, 1);
		test.done();
	};

	exports["Can flip when having 2 big jokers"] = function(test){
		var cards = Cards.cards([Card.bigJoker(), Card.bigJoker()]);
		test.equals(cards.canFlip(), true);
		test.done();
	};

	exports["Can flip when having 2 small jokers"] = function(test){
		var cards = Cards.cards([Card.smallJoker(), Card.smallJoker()]);
		test.equals(cards.canFlip(), true);
		test.done();
	};
	exports["Can flip when having 1 small joker and 1 heart"] = function(test){
		var cards = Cards.cards([Card.smallJoker(), Card.heart(Rank.TWO)]);
		test.equals(cards.canFlip(), true);
		test.done();
	};
});
