var Card = require('../routes/card.js').Card;

exports['Rank equals'] = function(test){
	test.ok(Card.Ranks.QUEEN.equals(Card.Ranks.QUEEN));
	test.ok(!Card.Ranks.QUEEN.equals(Card.Ranks.KING));

	test.done();
};

exports['Suit equals'] = function(test){
	test.ok(Card.Suits.H.equals(Card.Suits.H));
	test.ok(Card.Suits.J.equals(Card.Suits.J));

	test.ok(!Card.Suits.H.equals(Card.Suits.C));
	test.done();
};
exports['Card equals'] = function(test){
	console.log("---" + Card.heart(Card.Ranks.QUEEN));
	test.ok(Card.heart(Card.Ranks.QUEEN).equals(Card.heart(Card.Ranks.QUEEN)));
	test.ok(Card.smallJoker().equals(Card.smallJoker()));
	test.ok(Card.club(Card.Ranks.TWO).equals(Card.club(Card.Ranks.TWO)));

	test.ok(!Card.smallJoker().equals(Card.bigJoker()));
	test.ok(!Card.club(Card.Ranks.TWO).equals(Card.club(Card.Ranks.THREE)));

	test.done();
};

exports['0 decks'] = function(test){
	test.equal(Card.decks(0).length, 0);
	test.done();
};

exports['1 deck has 54 cards'] = function(test){
	var cards = Card.decks(1);
	test.equal(cards.length, 54);
	test.ok(cards.contains(Card.smallJoker()));
	test.ok(cards.contains(Card.bigJoker()));
	test.ok(cards.contains(Card.heart(Card.Ranks.QUEEN)));
	test.done();
};
exports['2 deck2 has 108 cards'] = function(test){
	var cards = Card.decks(2);
	test.equal(cards.length, 108);
	test.done();
};