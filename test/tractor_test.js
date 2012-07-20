var TractorGame = require('../routes/tractor.js').TractorGame, 
Player = require('../routes/tractor.js').Player, 
TractorRound = require('../routes/tractor.js').TractorRound;


exports['Tractor game is new'] = function(test){
	var tractorGame = new TractorGame();
	test.equals(tractorGame.gameState, TractorGame.GameState.WAITING);
	test.ok(!tractorGame.seats.full());

	test.done();
};

exports['Tractor game can be joined'] = function(test){
	var tractorGame = new TractorGame();
	tractorGame.join(jacky, 0);
	test.ok(!tractorGame.seats.full());
	test.equals(tractorGame.gameState, TractorGame.GameState.WAITING);

	test.done();
};

exports['Tractor game can not be joined when there are already 4 players'] = function(test){	
	var tractorGame = new TractorGame();
	tractorGame.join(jacky, 0);
	tractorGame.join(nana, 1);
	tractorGame.join(kerry, 2);
	tractorGame.join(yao, 3);
	test.ok(tractorGame.seats.full());
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
	test.ok(typeof(seats.defenders()) == undefined);
	test.equals(seats.teams[0].rank == Card.Ranks.TWO);
	
	test.done();
};

var jacky = new Player('Jacky');
var nana = new Player('Nana');
var kerry = new Player('Kerry');
var yao = new Player('Yao');

function readyGame(){
	var tractorGame = new TractorGame();
	tractorGame.join(jacky, 0);
	tractorGame.join(nana, 1);
	tractorGame.join(kerry, 2);
	tractorGame.join(yao, 3);
	
	return tractorGame;
}