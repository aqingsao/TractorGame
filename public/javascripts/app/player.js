define(['common', 'app/cards'], function(Common, Cards){
	var Player = Common.Backbone.Model.extend({
		initialize: function(name){
			this.set({name: name, cards: Cards.cards()});
		},
		hasCards: function(cards){ 
			var that = this; 
		    return  cards.all(function(card){
				return that.get('cards').contains(card);
			});
		}, 
		deal: function(card){
			this.get('cards').add(card);
		}, 
		equals: function(another){
			return this.get("name") == another.get("name");
		}, 
		canFlip: function(){
			return this.get('cards').canFlip();
		}, 
		sortedCards: function(){
			return this.get('cards').sortBy(function(card){
				return card.get('rank').get('value');
			});
		}
	});
	return Player;
});