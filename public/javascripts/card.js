var Backbone = require('backbone'), 
	_ = require('underscore')._, 
	util = require('util');

var Suit = Backbone.Model.extend({
	initialize: function(name){
		this.name = name,
		this.equals = function(other){
			return this.name == other.name;
		};
	}
});
var Rank = function(name, value, point, isJoker){
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
};

var Card = Backbone.Model.extend({
	initialize: function(suit, rank){
		if(!rank.matchSuit(suit)){
			throw "Invalid card with suit " + suit +' and rank ' + rank;
		}
		
		this.suit = suit;
		this.rank = rank;
		this.equals = function(other){
			return this.suit.equals(other.suit) && this.rank.equals(other.rank);
		}
	}, 
	isJoker: function(){
		return this.rank.isJoker;
	}, 
	isBlackSuit: function(){
		return this.suit== Card.Suits.C || this.suit == Card.Suits.S;
	},
	isRedSuit: function(){
		return this.suit== Card.Suits.H || this.suit == Card.Suits.D;
	}, 
	isSmallJoker: function(){
		return this.rank == Card.Ranks.SMALL_JOKER;
	},
	isBigJoker: function(){
		return this.rank == Card.Ranks.BIG_JOKER;
	}, 
	sameSuit: function(another){
		return this.suit == another.suit;
	}, 
	toString: function(){
		return this.suit.name + this.rank.name;
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
		var cards = new Cards();
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
	Ranks: {TWO: new Rank('2', 2, 0), THREE: new Rank('3', 3, 0), FOUR: new Rank('4', 4, 0), FIVE: new Rank('5', 5, 5), 
		SIX: new Rank('6', 6, 0), SEVEN: new Rank('7', 7, 0), EIGHT: new Rank('8', 8, 0), NINE: new Rank('9', 9, 0), TEN: new Rank('10', 10, 10), 
		JACK: new Rank('J', 11, 0), QUEEN: new Rank('Q', 12, 0), KING: new Rank('K', 13, 10), ACE: new Rank('A', 14, 0), 
		SMALL_JOKER: new Rank('Small', 300, 0), BIG_JOKER: new Rank('Big', 500, 0)}, 
	Suits: {H: new Suit('HEART'), S: new Suit("SPADE"), D: new Suit("DIAMOND"), C: new Suit("CLUB"), J: new Suit("Joker")}
});
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
		var suit = this.at(0).suit;
		return this.all(function(c){
			return c.suit == suit;
		});
	}, 
	canFlip: function(){
		return true;
	}, 
	toString: function(){
		var str = "[";
		this.each(function(card){
			str += card.toString();
		});         
		str += ']';
		return str;
	}
});

var Player = Backbone.Model.extend({
	initialize: function(name){
		this.name = name;
		this.cards = Card.cards();
	},
	deal: function(card){
		this.cards.add(card);
	}
});

exports.Card= Card;