var TractorGame = require('../public/javascripts/tractor.js').TractorGame, 
Player = require('../public/javascripts/player.js').Player, 
TractorRound = require('../public/javascripts/tractor.js').TractorRound;
var Card = require('../public/javascripts/card.js').Card, 
_ = require("underscore")._, 
broader = require('../model/broader.js').Broader; 
var io = {sockets: {on: function(){}}};
broader.init(io);


exports['Tractor game is new'] = function(test){
	var tractorGame = new TractorGame(1);
	test.equals(tractorGame.gameState, TractorGame.GameState.WAITING);
	test.ok(!tractorGame.seats.full());

	test.done();
};

exports['Tractor game can be joined'] = function(test){
	var tractorGame = new TractorGame(1);
	tractorGame.join(jacky, 0);
	test.ok(!tractorGame.seats.full());
	test.equals(tractorGame.gameState, TractorGame.GameState.WAITING);

	test.done();
};

exports['Tractor game cannot be joined by same player'] = function(test){
	var tractorGame = new TractorGame(1);
	tractorGame.join(jacky, 0);
	test.throws(function(){tractorGame.join(jacky, 1)}, "Cannot take seat");

	test.done();
};
exports['Tractor game cannot be joined when seat is taken'] = function(test){
	var tractorGame = new TractorGame(1);
	tractorGame.join(jacky, 0);
	test.throws(function(){tractorGame.join(nana, 0)}, "Cannot take seat");

	test.done();
};

exports['Tractor game can not be joined when there are already 4 players'] = function(test){	
	var tractorGame = new TractorGame(1);
	tractorGame.join(jacky, 0);
	tractorGame.join(nana, 1);
	tractorGame.join(kerry, 2);
	tractorGame.join(yao, 3);
	test.ok(tractorGame.seats.full());
	test.equals(tractorGame.gameState, TractorGame.GameState.PLAYING);
	test.throws(function(){tractorGame.join('Bin', 0)}, "Cannot join this game");
	
	test.done();
};

exports['Tractor round should be ready when 4 players join'] = function(test){
	var tractorRound = readyGame().tractorRound;
	test.equals(tractorRound.state, TractorGame.RoundState.READY);
	
	test.done();
};

exports['Tractor round can start and deal cards when ready'] = function(test){
	var tractorRound = readyGame().tractorRound;
	test.equals(tractorRound.state, TractorGame.RoundState.READY);
	
	tractorRound.start();
	test.equals(tractorRound.state, TractorGame.RoundState.DEALING);
	
	var totalTime = 0;
	var assertion = function(){
		if(yao.cards.size() < 25 && totalTime < 10){
			setTimeout(assertion, 1000);
		}
		else{
			test.equals(yao.cards.size(), 25);
			test.done();
		}
	}
	assertion();
};

exports["Non team is defender at startup"] = function(test){
	var tractorGame = readyGame();
	var seats = tractorGame.seats;
	test.equals(seats.pairs.size(), 2);
	test.equals(seats.pairs.at(0).rank(), Card.Ranks.TWO);
	test.equals(seats.pairs.at(1).rank(), Card.Ranks.TWO);
	test.ok(seats.defenders() == undefined);
	test.ok(seats.attackers() == undefined);
	
	test.done();
};
exports["cannot flip cards when tractor not ready."] = function(test){
	var tractorGame = new TractorGame(1);	
	test.throws(function(){tractorGame.flip(jacky, [smallJoker, heart2])}, "You cannot flip cards");
	
	test.done();
};

exports["Player can flip when having available jokers and trumps."] = function(test){
	var tractorGame = readyGame();
	var tractorRound = tractorGame.tractorRound;
	var originalDeal = tractorRound.deal;
	var smallJoker = Card.smallJoker();
	var heart2 = Card.heart(Card.Ranks.TWO);
	tractorRound.deal = function(){
		stubDeal([{player: jacky, cards: Card.cards(smallJoker, heart2)}]);
	};	
	tractorRound.start();
	
	tractorGame.flip(jacky, Card.cards([smallJoker, heart2]));
	
	var seats = tractorGame.seats;
	test.equals(seats.pairs.at(0).rank(), Card.Ranks.TWO);
	test.ok(seats.defenders() != undefined);
	test.equals(seats.defenders().hasPlayer(jacky), true);
	test.equals(seats.defenders().hasPlayer(kerry), true);
	test.ok(seats.attackers() != undefined);
	test.equals(seats.attackers().hasPlayer(nana), true);
	test.equals(seats.attackers().hasPlayer(yao), true);
	
	tractorRound.deal = originalDeal;
	test.done();
};

exports["Player can overturn when having bigger jokers and trumps"] = function(test){
	var tractorGame = readyGame();
	var tractorRound = tractorGame.tractorRound;
	var originalDeal = tractorRound.deal;
	var smallJoker = Card.smallJoker();
	var heart2 = Card.heart(Card.Ranks.TWO);
	var diamond1 = Card.diamond(Card.Ranks.TWO);
	var diamond2 = Card.diamond(Card.Ranks.TWO);
	tractorRound.deal = function(){
		stubDeal([{player: jacky, cards: Card.cards(smallJoker, heart2)}, {player: yao, cards: Card.cards(smallJoker, diamond1, diamond2)}]);
	};	
	tractorRound.start();
	
	tractorGame.flip(jacky, Card.cards([smallJoker, heart2]));
	
	var seats = tractorGame.seats;
	test.equals(seats.defenders().hasPlayer(jacky), true);
	test.equals(seats.attackers().hasPlayer(yao), true);
	
	tractorGame.flip(yao, Card.cards([smallJoker, diamond1, diamond2]));
	test.equals(seats.defenders().hasPlayer(yao), true);
	test.equals(seats.attackers().hasPlayer(jacky), true);
	
	tractorRound.deal = originalDeal;
	test.done();
};
exports["Player cannot overturn when not having bigger jokers and trumps"] = function(test){
	var tractorGame = readyGame();
	var tractorRound = tractorGame.tractorRound;
	var originalDeal = tractorRound.deal;
	var smallJoker = Card.smallJoker();
	var heart2 = Card.heart(Card.Ranks.TWO);
	var diamond1 = Card.diamond(Card.Ranks.TWO);
	tractorRound.deal = function(){
		stubDeal([{player: jacky, cards: Card.cards(smallJoker, heart2)}, {player: yao, cards: Card.cards(smallJoker, diamond1)}]);
	};	
	tractorRound.start();
	
	tractorGame.flip(jacky, Card.cards([smallJoker, heart2]));
	
	var seats = tractorGame.seats;
	test.equals(seats.defenders().hasPlayer(jacky), true);
	test.equals(seats.attackers().hasPlayer(yao), true);
	
	test.throws(function(){tractorGame.flip(yao, [smallJoker, diamond1])}, "");
	test.equals(seats.defenders().hasPlayer(jacky), true);
	test.equals(seats.attackers().hasPlayer(yao), true);
	
	tractorRound.deal = originalDeal;
	test.done();
};

exports["Player cannot flip rank3 when currently playing rank 2"] = function(test){
	var tractorGame = readyGame();
	var tractorRound = tractorGame.tractorRound;
	var originalDeal = tractorRound.deal;
	var smallJoker = Card.smallJoker();
	var heart3 = Card.heart(Card.Ranks.THREE);
	tractorRound.deal = function(){
		stubDeal([{player: jacky, cards: Card.cards(smallJoker, heart3)}]);
	};	
	tractorRound.start();
	
	test.throws(function(){tractorGame.flip(jacky, [smallJoker, heart3])}, "You cannot flip cards");
		
	tractorRound.deal = originalDeal;
	test.done();
};

exports["Player can flip 2 jokers when currently playing rank2"] = function(test){
	var tractorGame = readyGame();
	var tractorRound = tractorGame.tractorRound;
	var originalDeal = tractorRound.deal;
	var smallJoker1 = Card.smallJoker();
	var smallJoker2 = Card.smallJoker();
	tractorRound.deal = function(){
		stubDeal([{player: jacky, cards: Card.cards(smallJoker1, smallJoker2)}]);
	};	
	tractorRound.start();
	
	tractorGame.flip(jacky, Card.cards([smallJoker1, smallJoker2]));
	
	var seats = tractorGame.seats;
	test.equals(seats.defenders().hasPlayer(jacky), true);
	// test.equals(seats.attackers().hasPlayer(yao), true);
		// 
	// tractorRound.deal = originalDeal;
	test.done();
};

exports["cannot flip cards when players has no trump cards"] = function(test){
	var tractorGame = readyGame();
	var tractorRound = tractorGame.tractorRound;
	var originalDeal = tractorRound.deal;
	tractorRound.deal = function(){
		stubDeal([]);
	};	
	tractorRound.start();
	
	test.throws(function(){tractorGame.flip(jacky, [smallJoker, heart3])}, "Cannot flip cards");
		
	tractorRound.deal = originalDeal;
	test.done();
};

exports["Player could sort card by suit"] = function(test){  
	var jacky = new Player({name: 'Jacky'});
    jacky.deal(Card.smallJoker());
	jacky.deal(Card.heart(Card.Ranks.TWO));
	var cards = jacky.sortedCards();
	test.equals(cards.length, 2);  
	test.ok(cards[1].equals(Card.smallJoker()));
	test.ok(cards[0].equals(Card.heart(Card.Ranks.TWO)));
	test.done();
}

var jacky = new Player({name: 'Jacky'});
var nana = new Player({name: 'Nana'});
var kerry = new Player({name: 'Kerry'});
var yao = new Player({name: 'Yao'});

function stubDeal(cardsForPlayer){
	_.each(cardsForPlayer, function(obj){
		var player = obj.player;
		var cards = obj.cards;
		cards.each(function(card){
			player.deal(card);
		});
	});
};
function readyGame(){
	var tractorGame = new TractorGame(1);
	tractorGame.join(jacky, 0);
	tractorGame.join(nana, 1);
	tractorGame.join(kerry, 2);
	tractorGame.join(yao, 3);
	
	return tractorGame;
}