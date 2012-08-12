var requirejs = require('requirejs');

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['backbone', 'underscore', 'util', './rank', './suit'], function(Backbone, _, util, Rank, Suit){  
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
			return this.suit== Suit.C || this.suit == Suit.S;
		},
		isRedSuit: function(){
			return this.suit== Suit.H || this.suit == Suit.D;
		}, 
		isSmallJoker: function(){
			return this.rank == Rank.SMALL_JOKER;
		},
		isBigJoker: function(){
			return this.rank == Rank.BIG_JOKER;
		}, 
		sameSuit: function(another){
			return this.suit == another.suit;
		}, 
		toString: function(){
			return this.suit.name + this.rank.name;
		}
	}, {
		heart: function(rank){
			return new Card(Suit.H, rank);
		}, 
		club: function(rank){
			return new Card(Suit.C, rank);
		},
		diamond: function(rank){
			return new Card(Suit.D, rank);
		},
		spade: function(rank){
			return new Card(Suit.S, rank);
		},
		joker: function(rank){
			return new Card(Suit.J, rank);
		}, 
		smallJoker: function(){
			return Card.joker(Rank.SMALL_JOKER);
		},
		bigJoker: function(){
			return Card.joker(Rank.BIG_JOKER);
		}
	});
	return Card;
});