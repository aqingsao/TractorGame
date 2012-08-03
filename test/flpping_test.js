var TractorGame = require('../public/javascripts/tractor.js').TractorGame, 
Player = require('../public/javascripts/tractor.js').Player, 
TractorRound = require('../public/javascripts/tractor.js').TractorRound, 
Flipping = require('../public/javascripts/flipping.js'), 
Card = require('../public/javascripts/card.js').Card;


exports['Cannot flip when jokers size is 0'] = function(test){
	var flipping = new Flipping(jacky, Card.cards(), Card.cards());
	test.ok(!flipping.isValid());

	test.done();
};
exports['Cannot flip when only has 1 joker and no suits'] = function(test){
	var flipping = new Flipping(jacky, Card.cards([Card.smallJoker()]), Card.cards());
	test.ok(!flipping.isValid());

	test.done();
};
exports['Cannot flip and have 1 joker and 3 or more spades'] = function(test){
	var flipping = new Flipping(jacky, Card.cards([Card.bigJoker()]), Card.cards([Card.spade(Card.Ranks.TWO), Card.spade(Card.Ranks.THREE), Card.spade(Card.Ranks.TWO)]));
	test.ok(!flipping.isValid());
	
	test.done();
};

exports['Cannot flip when only has 1 small joker and 1 club'] = function(test){
	var flipping = new Flipping(jacky, Card.cards([Card.smallJoker()]), Card.cards([Card.club(Card.Ranks.TWO)]));
	test.ok(!flipping.isValid());

	test.done();
};
exports['Cannot flip when only has 1 big joker and 1 heart'] = function(test){
	var flipping = new Flipping(jacky, Card.cards([Card.bigJoker()]), Card.cards([Card.heart(Card.Ranks.TWO)]));
	test.ok(!flipping.isValid());

	test.done();
};
exports['Can flip and have level 1 when only has 1 big joker and 1 spade'] = function(test){
	var flipping = new Flipping(jacky, Card.cards([Card.bigJoker()]), Card.cards([Card.spade(Card.Ranks.TWO)]));
	test.ok(flipping.isValid());
	test.equals(flipping.level, 1)
	test.done();
};
exports['Can flip and have level 1 when only has 1 small joker and 1 heart'] = function(test){
	var flipping = new Flipping(jacky, Card.cards([Card.smallJoker()]), Card.cards([Card.heart(Card.Ranks.TWO)]));
	test.ok(flipping.isValid());
	test.equals(flipping.level, 1);
	
	test.done();
};
exports['Cannot flip when has 1 small joker and 1 heart and 1 club'] = function(test){
	var flipping = new Flipping(jacky, Card.cards([Card.smallJoker()]), Card.cards([Card.heart(Card.Ranks.TWO), Card.club(Card.Ranks.TWO)]));
	test.ok(!flipping.isValid());
	
	test.done();
};
exports['Cannot flip when has 1 small joker and 1 heart TWO and 1 heart THREE'] = function(test){
	var flipping = new Flipping(jacky, Card.cards([Card.smallJoker()]), Card.cards([Card.heart(Card.Ranks.TWO), Card.heart(Card.Ranks.THREE)]));
	test.ok(!flipping.isValid());
	
	test.done();
};
exports['Cannot flip when has 1 small joker and 2 clubs TWO'] = function(test){
	var flipping = new Flipping(jacky, Card.cards([Card.smallJoker()]), Card.cards([Card.club(Card.Ranks.TWO), Card.club(Card.Ranks.TWO)]));
	test.ok(!flipping.isValid());
	
	test.done();
};
exports['Cannot flip when has 1 big joker and 2 diamonds TWO'] = function(test){
	var flipping = new Flipping(jacky, Card.cards([Card.bigJoker()]), Card.cards([Card.diamond(Card.Ranks.TWO), Card.diamond(Card.Ranks.TWO)]));
	test.ok(!flipping.isValid());
	
	test.done();
};
exports['Can flip and have level 2 when has 1 big joker and 2 spades TWO'] = function(test){
	var flipping = new Flipping(jacky, Card.cards([Card.bigJoker()]), Card.cards([Card.spade(Card.Ranks.TWO), Card.spade(Card.Ranks.TWO)]));
	test.ok(flipping.isValid());
	test.equals(flipping.level, 2);
	
	test.done();
};
exports['Cannot flip when 1 small joker and 1 big joker'] = function(test){
	var flipping = new Flipping(jacky, Card.cards([Card.bigJoker(), Card.smallJoker()]), Card.cards([]));
	test.ok(!flipping.isValid());
	
	test.done();
};
exports['Cannot flip when have 2 small jokers and 1 suit'] = function(test){
	var flipping = new Flipping(jacky, Card.cards([Card.bigJoker(), Card.smallJoker()]), Card.cards([Card.spade(Card.Ranks.TWO)]));
	test.ok(!flipping.isValid());
	
	test.done();
};
exports['Can flip and have level 5 when have 2 small jokers only'] = function(test){
	var flipping = new Flipping(jacky, Card.cards([Card.smallJoker(), Card.smallJoker()]), Card.cards([]));
	test.ok(flipping.isValid());
	test.equals(flipping.level, 5);
	
	test.done();
};
exports['Can flip and have level 10 when have 2 big jokers only'] = function(test){
	var flipping = new Flipping(jacky, Card.cards([Card.bigJoker(), Card.bigJoker()]), Card.cards([]));
	test.ok(flipping.isValid());
	test.equals(flipping.level, 10);
	
	test.done();
};

var jacky = new Player('Jacky');
var nana = new Player('Nana');
var kerry = new Player('Kerry');
var yao = new Player('Yao');

function readyGame(){
	var tractorGame = new TractorGame();
	tractorGame.join(jacky);
	tractorGame.join(nana);
	tractorGame.join(kerry);
	tractorGame.join(yao);
	
	return tractorGame;
}
