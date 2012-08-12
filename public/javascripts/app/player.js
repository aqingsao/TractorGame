var requirejs = require('requirejs');

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['backbone', 'underscore', 'util', './cards'], function(Backbone, _, util, Cards){
	var Player = Backbone.Model.extend({
		initialize: function(){
			this.cards = Cards.cards();
		}, 
		hasCards: function(cards){ 
			var that = this;
			_.each(cards, function(card){
				if(!that.cards.contains(card)){
					return false;
				}
			});
			return true;
		}, 
		deal: function(card){
			this.cards.add(card);
		}, 
		equals: function(another){
			return this.get("name") == another.get("name");
		}, 
		canFlip: function(){
			return this.cards.canFlip();
		}, 
		sortedCards: function(){
			return this.cards.sortBy(function(card){
				return card.rank.value;
			});
		}
	});
	return Player;
});
