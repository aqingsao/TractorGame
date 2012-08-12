var requirejs = require('requirejs');
requirejs.config({
    nodeRequire: require
});
 
requirejs(['../public/javascripts/app/suit.js'], function(Suit){  
	exports['Suit equals'] = function(test){
		test.ok(Suit.H.equals(Suit.H));
		test.ok(Suit.J.equals(Suit.J));
	
		test.ok(!Suit.H.equals(Suit.C));
		test.done();
	};
});