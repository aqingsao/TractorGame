var requirejs = require('requirejs');
requirejs.config({
	baseUrl: 'public/javascripts', 
	nodeRequire: require
}); 
 
requirejs(['app/seat', 'app/rank', 'app/player'], function(Seat, Rank, Player){  
	exports['Seat start from rank 2'] = function(test){
		var seat = new Seat();
	
		test.equals(seat.get('rank'), Rank.TWO);
		test.done();
	};
	exports['Seat is neither attacker nor defender in default'] = function(test){
		var seat = new Seat();
	
		test.equals(seat.get('attacker'), false);
		test.equals(seat.get('defender'), false);
		test.done();
	};
	exports['Seat can be set to defender'] = function(test){
		var seat = new Seat();  
		seat.setDefender(true);
	
		test.equals(seat.get('attacker'), false);
		test.equals(seat.get('defender'), true);
		test.done();
	};
	exports['Seat is not taken in default'] = function(test){
		var seat = new Seat();  
			
		test.ok(!seat.isTaken());
		test.done();
	};
	exports['Seat can be taken by a player'] = function(test){
		var seat = new Seat();  
		seat.join(new Player());	                   
		
		test.ok(seat.isTaken());
		test.done();
	};
});