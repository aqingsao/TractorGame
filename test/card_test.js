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

exports["Card isSmallJoker or isBigJoker or isRedSuit or isBlackSuit"] = function(test){
	test.ok(Card.heart(Card.Ranks.JACK).isRedSuit());
	test.ok(!Card.heart(Card.Ranks.JACK).isBlackSuit());
	test.ok(!Card.heart(Card.Ranks.JACK).isSmallJoker());

	test.ok(Card.smallJoker().isSmallJoker());
	test.ok(!Card.heart(Card.Ranks.JACK).isSmallJoker());
	test.ok(!Card.bigJoker(Card.Ranks.JACK).isSmallJoker());
	
	test.ok(!Card.smallJoker().isBigJoker());
	test.ok(!Card.heart(Card.Ranks.JACK).isBigJoker());
	test.ok(Card.bigJoker(Card.Ranks.JACK).isBigJoker());
	
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

exports['allSuits return true when cards is emtpy'] = function(test){
	var cards = Card.cards();
	test.ok(cards.allSuits());
	test.done();
};
exports['allSuits return true when cards are all suits'] = function(test){
	var cards = Card.cards([Card.heart(Card.Ranks.TWO), Card.club(Card.Ranks.THREE)]);
	test.ok(cards.allSuits());
	test.done();
};
exports['allSuits return false when at least one card is not suit'] = function(test){
	var cards = Card.cards([Card.smallJoker(), Card.club(Card.Ranks.THREE)]);
	test.ok(!cards.allSuits());
	test.done();
};
exports['allJokers return true when cards are all jokers'] = function(test){
	var cards = Card.cards([Card.smallJoker(), Card.bigJoker()]);
	test.ok(cards.allJokers());
	test.done();
};
exports['allJokers return false when at least one is not jokers'] = function(test){
	var cards = Card.cards([Card.heart(Card.Ranks.TWO), Card.bigJoker()]);
	test.ok(!cards.allJokers());
	test.done();
};
exports["sameSuits return true when cards with size 0"] = function(test){
	var cards = Card.cards([]);
	test.ok(cards.sameSuit());
	test.done();
};
exports["sameSuits return true when cards with size 1"] = function(test){
	var cards = Card.cards([Card.club(Card.Ranks.THREE)]);
	test.ok(cards.sameSuit());
	test.done();
};
exports["sameSuits return true when 2 cards have same suit"] = function(test){
	var cards = Card.cards([Card.club(Card.Ranks.THREE), Card.club(Card.Ranks.FOUR)]);
	test.ok(cards.sameSuit());
	test.done();
};
exports["sameSuits return false when 2 cards have not same suit"] = function(test){
	var cards = Card.cards([Card.club(Card.Ranks.THREE), Card.spade(Card.Ranks.FOUR)]);
	test.ok(!cards.sameSuit());
	test.done();
};

exports["could create several cards"] = function(test){
	var cards = Card.cards(Card.club(Card.Ranks.TWO));
	test.equals(cards.length, 1);
	test.done();
};

exports["Can flip when having 2 big jokers"] = function(test){
	var cards = Card.cards([Card.bigJoker(), Card.bigJoker()]);
	test.equals(cards.canFlip(), true);
	test.done();
};

exports["Can flip when having 2 small jokers"] = function(test){
	var cards = Card.cards([Card.smallJoker(), Card.smallJoker()]);
	test.equals(cards.canFlip(), true);
	test.done();
};
exports["Can flip when having 1 small joker and 1 heart"] = function(test){
	var cards = Card.cards([Card.smallJoker(), Card.heart(Card.Ranks.TWO)]);
	test.equals(cards.canFlip(), true);
	test.done();
};

exports["show have suit name and rank name"] = function(test){
	var heart2 = Card.heart(Card.Ranks.TWO);
	test.equals(heart2.suit.name, 'HEART');
	test.equals(heart2.rank.name, '2'); 
	test.done();
}