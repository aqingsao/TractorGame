var requirejs = require('requirejs');
requirejs.config({
	baseUrl: 'public/javascripts', 
	nodeRequire: require
}); 
 
requirejs(['app/seat', 'app/pair', 'app/rank'], function(Seat, Pair, Rank){  
	exports['Pair length is 2'] = function(test){ 
		var seat1 = new Seat(), seat2 = new Seat();
		var pair = new Pair([seat1, seat2]);
	
		test.equals(pair.length, 2);
		test.done();
	};
	exports['Pair is playing rank 2 in default'] = function(test){ 
		var seat1 = new Seat(), seat2 = new Seat();
		var pair = new Pair([seat1, seat2]);
	
		test.equals(pair.rank(), Rank.TWO);
		test.done();
	};
	exports['Pair is nor defender neither attacker in default'] = function(test){ 
		var seat1 = new Seat(), seat2 = new Seat();
		var pair = new Pair([seat1, seat2]);
	
		test.equals(pair.isDefender(), false);
		test.equals(pair.isAttacker(), false);
		test.done();
	};
});