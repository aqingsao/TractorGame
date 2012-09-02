define(['backbone', 'underscore', 'app/rank', 'app/suit'], function(Backbone, _, Rank, Suit){ 
	var Card = Backbone.Model.extend({
		initialize: function(suit, rank){
			if(!rank.matchSuit(suit)){
				throw "Invalid card with suit " + suit +' and rank ' + rank;
			}

			this.set({suit: suit, rank: rank});
		}, 
		isJoker: function(){
			return this.get('rank').isJoker();
		}, 
		isBlackSuit: function(){
			return this.get('suit')== Suit.C || this.get('suit') == Suit.S;
		},
		isRedSuit: function(){
			return this.get('suit')== Suit.H || this.get('suit') == Suit.D;
		}, 
		isSmallJoker: function(){
			return this.get('rank') == Rank.SMALL_JOKER;
		},
		isBigJoker: function(){
			return this.get('rank') == Rank.BIG_JOKER;
		}, 
		sameSuit: function(another){
			return this.get('suit') == another.suit;
		}, 
		equals: function(other){
			return this.get('suit').equals(other.get('suit')) && this.get('rank').equals(other.get('rank'));
		},
		toString: function(){
			return this.get('suit').get('name') + ' ' + this.get('rank').get('name');
		}, 
		jod: function(){ 
			var ret = {};
			var self = this;
			for(var key in this.attributes){  
				var val = this.attributes[key];
				if(typeof(val.jod) == 'function'){
					ret[key] = val.jod();
				}
				else{
					ret[key] = val;
				}
			};   
			return ret;
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
			return Cards.joker(Rank.SMALL_JOKER);
		},
		bigJoker: function(){
			return Cards.joker(Rank.BIG_JOKER);
		}
	});
	return Card;
});