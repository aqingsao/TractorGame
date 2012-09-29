define(['backbone', 'underscore', 'app/rank', 'app/suit'], function(Backbone, _, Rank, Suit){ 
	var Card = Backbone.Model.extend({
		initialize: function(){
		}, 
		// validate: function(attrs){  
		// 	if(!attrs.rank.matchSuit(attrs.suit)){
		// 		throw "Invalid card with suit " + attrs.suit +' and rank ' + attrs.rank;
		// 	}
		// },
		isJoker: function(){
			return this.isSmallJoker() || this.isBigJoker();
		}, 
		isBlackSuit: function(){
			return this.isSpade() || this.isClub();
		},
		isRedSuit: function(){
			return this.isHeart() || this.isDiamond();
		}, 
		isSpade: function(){
			return this.get('suit')== Suit.S;
		},
		isClub: function(){
			return this.get('suit')== Suit.C;
		},
		isHeart: function(){
			return this.get('suit')== Suit.H;
		}, 
		isDiamond: function(){
			return this.get('suit')== Suit.D;
		}, 
		isSmallJoker: function(){
			return this.get('suit') == Suit.SJ;
		},
		isBigJoker: function(){
			return this.get('suit') == Suit.BJ;
		}, 
		sameSuit: function(another){
			return this.get('suit') == another.suit;
		}, 
		equals: function(other){
			return this.get('suit').equals(other.get('suit')) && this.get('rank').equals(other.get('rank'));
		},
		match: function(json){
			return this.get('suit').get('name') == json.suit && this.get('rank').get('name') == json.rank;
		}, 
		toString: function(){
			return this.get('suit').get('name') + ' ' + this.get('rank').get('name');
		}
	}, {
		heart: function(rank){
			return new Card({suit: Suit.H, rank: rank});
		}, 
		club: function(rank){
			return new Card({suit: Suit.C, rank: rank});
		},
		diamond: function(rank){
			return new Card({suit: Suit.D, rank: rank});
		},
		spade: function(rank){
			return new Card({suit: Suit.S, rank: rank});
		},
		smallJoker: function(){
			return new Card({suit: Suit.SJ, rank: Rank.SMALL_JOKER});
		},
		bigJoker: function(){
			return new Card({suit: Suit.BJ, rank: Rank.BIG_JOKER});
		}, 
		fjod: function(json){    
			var card = new Card();
			card.set({rank: Rank.fjod(json.rank), suit: Suit.fjod(json.suit)});
			return card;
		}
	});
	return Card;
});