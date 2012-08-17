define(['common', 'app/cards'], function(Common, Cards){
	var Player = Common.Backbone.Model.extend({
		initialize: function(){
			this.cards = Cards.cards();
		}, 
		hasCards: function(cards){ 
			var that = this;
			Common._.each(cards, function(card){
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
