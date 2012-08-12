var requirejs = require('requirejs');

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(function(){ 
	var Rank = function(name, value, point, isJoker){
		this.name = name;
		this.value = value;
		this.point = point;
		this.isJoker = this.value >= 300;
		this.equals = function(other){
			return this.name == other.name && this.value == other.value;
		};
		this.matchSuit = function(suit){
			return (suit.isJoker() && this.isJoker) || (!suit.isJoker() && !this.isJoker);
		}
	};
	return {TWO: new Rank('2', 2, 0), THREE: new Rank('3', 3, 0), FOUR: new Rank('4', 4, 0), FIVE: new Rank('5', 5, 5), 
			SIX: new Rank('6', 6, 0), SEVEN: new Rank('7', 7, 0), EIGHT: new Rank('8', 8, 0), NINE: new Rank('9', 9, 0), TEN: new Rank('10', 10, 10), 
			JACK: new Rank('J', 11, 0), QUEEN: new Rank('Q', 12, 0), KING: new Rank('K', 13, 10), ACE: new Rank('A', 14, 0), 
			SMALL_JOKER: new Rank('Small', 300, 0), BIG_JOKER: new Rank('Big', 500, 0)};
	}
);