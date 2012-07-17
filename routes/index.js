var _ = require('underscore')._,
    Backbone = require('backbone'), 
	Card = require('./card.js');
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', { title: 'Express' })
};


console.log('init all tractor games');
var tractorGames = {};
exports.tractor = function(req, res){
	var id = req.params.id;
	if(tractorGames[id] == null){
		console.log("Open a new tractor room: " + id);
		tractorGames[id] = new TractorGame();
	}
	res.render('tractor', {tractorGame: tractorGames[id], title: 'Tractor'});
}