var requirejs = require('requirejs');
requirejs.config({
	baseUrl: 'public/javascripts', 
	nodeRequire: require
}); 
 
requirejs(['app/rank'], function(Rank){  
	exports['Rank equals'] = function(test){
		test.ok(Rank.QUEEN.equals(Rank.QUEEN));
		test.ok(!Rank.QUEEN.equals(Rank.KING));

		test.done();
	};
});
