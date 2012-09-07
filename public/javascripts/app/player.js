define(['backbone', 'underscore', 'app/cards'], function(Backbone, _, Cards){
	var Player = Backbone.Model.extend({
		hasCards: function(cards){ 
			var that = this; 
		    return  cards.all(function(card){
				return that.get('cards').contains(card);
			});
		}, 
		deal: function(card){
			if(this.get('cards') == undefined){
				this.set({'cards': Cards.cards()})
			}
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
	}, {
		fjod: function(json){
			if(json == undefined){
				return undefined;
			}
			return new Player({name: json.name, cards: json.cards});
		}
	});
	return Player;
});