var TractorGame = require('../routes/tractor.js').TractorGame, 
Player = require('../routes/tractor.js').Player, 
TractorRound = require('../routes/tractor.js').TractorRound;


exports['Tractor game is new'] = function(test){
	var tractorGame = new TractorGame();
	test.equals(tractorGame.gameState, TractorGame.GameState.WAITING);
	test.equal(tractorGame.players.size(), 0);

	test.done();
};

exports['Tractor game can be joined'] = function(test){
	var tractorGame = new TractorGame();
	tractorGame.join(new Player('Jacky Li'));
	test.equal(tractorGame.players.size(), 1);
	test.equals(tractorGame.gameState, TractorGame.GameState.WAITING);

	test.done();
};

exports['Tractor game can not be joined when there are already 4 players'] = function(test){	
	var tractorGame = new TractorGame();
	tractorGame.join(new Player('Jacky Li'));
	tractorGame.join(new Player('Nana'));
	tractorGame.join(new Player('Kerry'));
	tractorGame.join(new Player('Yao'));
	test.equals(tractorGame.players.size(), 4);
	test.equals(tractorGame.gameState, TractorGame.GameState.READY);
	test.throws(function(){tractorGame.join('Bin')}, "Cannot join this game");
	
	test.done();
};

exports['Tractor round should be ready when 4 players join'] = function(test){
	var tractorRound = readyGame().tractorRound;
	test.equals(tractorRound.state, TractorGame.RoundState.READY);
	
	test.done();
};

exports['Tractor round can start and flip when ready'] = function(test){
	var tractorRound = readyGame().tractorRound;
	test.equals(tractorRound.state, TractorGame.RoundState.READY);
	
	tractorRound.start();
	test.equals(tractorRound.state, TractorGame.RoundState.FLIPING);
	
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
}

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
