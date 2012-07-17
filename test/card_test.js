var Card = require('../routes/card.js');

exports['0 decks'] = function(test){
	test.equal(Card.decks(0).length, 0);
	test.done();
};

exports['1 deck has 54 cards'] = function(test){
	var cards = Card.decks(1);
	test.equal(cards.length, 54);
	test.done();
};

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
	test.ok(Card.Card.heart(Card.Ranks.QUEEN).equals(Card.Card.heart(Card.Ranks.QUEEN)));
	test.ok(Card.Card.joker(Card.Ranks.SMALL_JOKER).equals(Card.Card.joker(Card.Ranks.SMALL_JOKER)));
	test.ok(Card.Card.club(Card.Ranks.TWO).equals(Card.Card.club(Card.Ranks.TWO)));

	test.ok(!Card.Card.joker(Card.Ranks.SMALL_JOKER).equals(Card.Card.joker(Card.Ranks.BIG_JOKER)));
	test.ok(!Card.Card.club(Card.Ranks.TWO).equals(Card.Card.club(Card.Ranks.THREE)));

	test.done();
};