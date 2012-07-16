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

exports['1 deck has a big joker'] = function(test){
	var cards = Card.decks(1);
	// test.equal(Card.Card.joker(Card.Ranks.BIG_JOKER), Card.Card.joker(Card.Ranks.BIG_JOKER));
	// test.ok(cards.contains(new Card.card(Card.SUIT.JOKER, Card.Ranks.BIG_JOKER)));
	test.done();
};