var Backbone = require('backbone'), 
	_ = require('underscore')._;

var Suit = Backbone.Model.extend({
	initialize: function(name){
		this.name = name,
		this.equals = function(other){
			return this.name == other.name;
		};
	}
});
var Rank = Backbone.Model.extend({
	initialize: function(name, value, point, isJoker){
		this.name = name;
		this.value = value;
		this.point = point;
		this.isJoker = this.value >= 300;
		this.equals = function(other){
			return this.name == other.name && this.value == other.value;
		};
		this.matchSuit = function(suit){
			return (suit == Card.Suits.J && this.isJoker) || (suit != Card.Suits.J && !this.isJoker);
		}
	}
});

var Card = Backbone.Model.extend({
	initialize: function(suit, rank){
		if(!rank.matchSuit(suit)){
			throw "Invalid card with suit " + suit +' and rank ' + rank;
		}
		
		this.suit = suit;
		this.rank = rank;
		this.equals = function(other){
			return this.suit == other.suit && this.rank.equals(other.rank);
		}
	}	
}, {
	heart: function(rank){
		return new Card(Card.Suits.H, rank);
	}, 
	club: function(rank){
		return new Card(Card.Suits.C, rank);
	},
	diamond: function(rank){
		return new Card(Card.Suits.D, rank);
	},
	spade: function(rank){
		return new Card(Card.Suits.S, rank);
	},
	joker: function(rank){
		return new Card(Card.Suits.J, rank);
	}, 
	smallJoker: function(){
		return Card.joker(Card.Ranks.SMALL_JOKER);
	},
	bigJoker: function(){
		return Card.joker(Card.Ranks.BIG_JOKER);
	},
	decks: function(count){
		var cards = new Decks();
		while(count-- > 0){
			_.each(Card.Ranks, function(rank){
				if(rank.isJoker){
					cards.add(Card.joker(rank));
				}
			});
			_.each(Card.Ranks, function(rank){
				if(!rank.isJoker){
					cards.add(Card.heart(rank));
					cards.add(Card.spade(rank));
					cards.add(Card.diamond(rank));
					cards.add(Card.club(rank));
				}
			});
		}
		return cards;
	}, 
	Ranks: {TWO: new Rank('2', 2, 0), THREE: new Rank('3', 3, 0), FOUR: new Rank('4', 4, 0), FIVE: new Rank('5', 5, 5), 
		SIX: new Rank('6', 6, 0), SEVEN: new Rank('7', 7, 0), EIGHT: new Rank('8', 8, 0), NINE: new Rank('9', 9, 0), TEN: new Rank('10', 10, 10), 
		JACK: new Rank('J', 11, 0), QUEEN: new Rank('Q', 12, 0), KING: new Rank('K', 13, 10), ACE: new Rank('A', 14, 0), 
		SMALL_JOKER: new Rank('Joker', 300, 0), BIG_JOKER: new Rank('Joker', 500, 0)}, 
	Suits: {H: new Suit('HEART'), S: new Suit("SPADE"), D: new Suit("DIAMOND"), C: new Suit("CLUB"), J: new Suit("Joker")}
});
var Decks = Backbone.Collection.extend({
	model: Card, 
	contains: function(card){
		return this.any(function(c){
			return c.equals(card);
		});
	}, 
	shuffle: function(){
		var cards = Backbone.Collection.prototype.shuffle.call(this);
		return new Decks(cards);
	}
});

var Player = Backbone.Model.extend({
	initialize: function(name){
		this.name = name;
		this.cards = new Backbone.Collection();
	},
	deal: function(card){
		this.cards.add(card);
	}
});

exports.Card= Card;