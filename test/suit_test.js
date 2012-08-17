var requirejs = require('requirejs');
requirejs.config({
	baseUrl: 'public/javascripts', 
	nodeRequire: require
}); 
 
requirejs(['app/suit'], function(Suit){  
	exports['Suit equals'] = function(test){
		test.ok(Suit.H.equals(Suit.H));
		test.ok(Suit.J.equals(Suit.J));
	
		test.ok(!Suit.H.equals(Suit.C));
		test.done();
	};
});