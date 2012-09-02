var requirejs = require('requirejs');
requirejs.config({
	baseUrl: 'public/javascripts', 
	nodeRequire: require
}); 
 
requirejs(['app/seats', 'app/rank', 'app/player'], function(Seats, Rank, Player){  
	exports['Prepare 4 seats'] = function(test){
		var seats = Seats.prepareSeats();
	
		test.equals(seats.length, 4);
		test.done();
	};
	exports['Seats are not full when not all are taken by players'] = function(test){
		var seats = Seats.prepareSeats();
		
		test.equals(seats.full(), false);
		test.done();
	};
	exports['Seats are full when all are taken by players'] = function(test){
		var seats = Seats.prepareSeats(); 
		seats.join(jacky, 0);
		seats.join(nana, 1);
		seats.join(yao, 2);
		seats.join(kerry, 3);
		
		test.equals(seats.full(), true);
		test.done();
	}; 
	var jacky = new Player({name: 'Jacky'});
	var nana = new Player({name: 'Nana'});
	var kerry = new Player({name: 'Kerry'});
	var yao = new Player({name: 'Yao'});
});