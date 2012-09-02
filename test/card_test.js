var requirejs = require('requirejs');
requirejs.config({
	baseUrl: 'public/javascripts', 
	nodeRequire: require
}); 
 
requirejs(['app/card', 'app/rank'], function(Card, Rank){  
	exports['Card equals'] = function(test){
		var card = Card.heart(Rank.TWO); 
		console.log(card.jod());
		test.done();
	};
});