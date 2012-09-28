define(['backbone', 'underscore', 'app/rank', 'app/suit', 'app/card'], function(Backbone, _, Rank, Suit, Card){ 
	var Cards = Backbone.Collection.extend({
		model: Card, 
		contains: function(card){  
			return this.any(function(c){
				return c.equals(card);
			});
		}, 
		shuffle: function(){
			var cards = Backbone.Collection.prototype.shuffle.call(this);
			this.models = cards;
			return this;
		}, 
		allSuits: function(){
			return this.all(function(c){
				return !c.isJoker();
			});
		}, 
		allJokers: function(){
			return this.all(function(c){
				return c.isJoker();
			});
		}, 
		sameSuit: function(){
			if(this.size() < 2){
				return true;
			}
			var suit = this.at(0).get('suit');
			return this.all(function(c){
				return c.get('suit') == suit;
			});
		}, 
		canFlip: function(){
			return true;
		}, 
		toString: function(){
			var str = "[";
			this.each(function(card){
				str += card.toString();  
				str += ', '
			});         
			str += ']';
			return str;
		}
	}, {
		decks: function(count){
			var cards = new Cards();
			
			while(count-- > 0){
				cards.add(Card.smallJoker());
				cards.add(Card.bigJoker());
				_.each(Rank, function(rank){
					if(rank.isJoker != undefined && !rank.isJoker()){
						cards.add(Card.heart(rank));
						cards.add(Card.spade(rank));
						cards.add(Card.diamond(rank));
						cards.add(Card.club(rank));
					}
				});
			} 
			return cards;
		}, 
		cards: function(initialCards){
			var cards = new Cards();
			if(initialCards == undefined){
				return cards;
			}
			if(initialCards.constructor === Array){
				_.each(initialCards, function(card){
					cards.add(card);
				});
			}
			else{
				cards.add(initialCards);	
			}
			return cards;
		}, 
		fjod: function(json){
			return Cards.cards(json);
		}
	}); 
	return Cards;
});