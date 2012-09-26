var requirejs = require('requirejs');
requirejs.config({
	baseUrl: 'public/javascripts'
}); 
requirejs(["app/player", "app/cards", "app/card", "app/rank"], function(Player, Cards, Card, Rank){
	exports['Player jakcy equals player jacky'] = function(test){ 
		var player = new Player({name: "Jacky"}); 
		var jacky = new Player({name:'Jacky'});
		
		test.ok(player.equals(jacky));

		test.done();
	};
	exports['Player jacky not equals player nana'] = function(test){ 
		var nana = new Player({name: "Nana"}); 
		var jacky = new Player({name:'Jacky'});
		
		test.ok(!nana.equals(jacky));

		test.done();
	};
})