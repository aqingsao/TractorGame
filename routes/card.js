var Backbone = require('backbone'), 
	_ = require('underscore')._;

var SUIT = {HEART: {value: 0}, SPADE: {value: 1}, DIAMOND: {value:2}, CLUB: {value:3}, JOKER: {value: 4}};
var Number = Backbone.Model.extend({
	initialize: function(name, value, point, isJoker){
		this.name = name;
		this.value = value;
		this.point = point;
		this.isJoker = false || isJoker;
		this.equals = function(other) {
		     return other.name == this.name;
		 };
	}
});
var Ranks= {TWO: new Number('2', 2, 0), THREE: new Number('3', 3, 0), FOUR: new Number('4', 4, 0), FIVE: new Number('5', 5, 5), 
	SIX: new Number('6', 6, 0), SEVEN: new Number('7', 7, 0), EIGHT: new Number('8', 8, 0), NINE: new Number('9', 9, 0), TEN: new Number('10', 10, 10), 
	JACK: new Number('J', 11, 0), QUEEN: new Number('Q', 12, 0), KING: new Number('K', 13, 10), ACE: new Number('A', 14, 0), 
	SMALL_JOKER: new Number('Joker', 300, 0, true), BIG_JOKER: new Number('Joker', 500, 0, true)};

var Card = Backbone.Model.extend({
	initialize: function(suit, number){
		if(suit == SUIT.JOKER && !number.isJoker){
			throw "Invalid card with suit " + suit +' and number ' + number;
		}
		if(suit != SUIT.JOKER && number.isJoker){
			throw "Invalid card with suit " + suit +' and number ' + number;
		}
		
		this.suit = suit;
		this.number = number;
		this.equals = function(other) {
		     return true;
		 };
	}	
}, {
	heart: function(number){
		return new Card(SUIT.HEART, number);
	}, 
	club: function(number){
		return new Card(SUIT.CLUB, number);
	},
	diamond: function(number){
		return new Card(SUIT.DIAMOND, number);
	},
	spade: function(number){
		return new Card(SUIT.SPADE, number);
	},
	joker: function(number){
		return new Card(SUIT.JOKER, number);
	}
});

exports.decks= function(deckCount){
			var decks = new Backbone.Collection();

			while(deckCount-- > 0){
				_.each(Ranks, function(rank){
					if(rank.isJoker){
						decks.add(new Card(SUIT.JOKER, rank));
					}
				});
				_.each(Ranks, function(rank){
					if(!rank.isJoker){
						decks.add(new Card(SUIT.HEART, rank));
						decks.add(new Card(SUIT.SPADE, rank));
						decks.add(new Card(SUIT.DIAMOND, rank));
						decks.add(new Card(SUIT.CLUB, rank));
					}
				});
			}

			console.log("Cards for return" + decks.length);

			return decks;
};
exports.SUIT= SUIT;
exports.Ranks= Ranks; 
exports.Card= Card;