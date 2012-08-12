var requirejs = require('requirejs');
requirejs.config({
    nodeRequire: require
});
 
requirejs(['../public/javascripts/app/rank.js'], function(Rank){  
	exports['Rank equals'] = function(test){
		test.ok(Rank.QUEEN.equals(Rank.QUEEN));
		test.ok(!Rank.QUEEN.equals(Rank.KING));

		test.done();
	};
});
