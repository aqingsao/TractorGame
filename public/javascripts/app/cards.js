define(['common', 'app/rank', 'app/suit'], function(Common, Rank, Suit){ 
	var Card = Common.Backbone.Model.extend({
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
		}
	});
	var Cards = Common.Backbone.Collection.extend({
		model: Card, 
		contains: function(card){  
			return this.any(function(c){
				return c.equals(card);
			});
		}, 
		shuffle: function(){
			var cards = Common.Backbone.Collection.prototype.shuffle.call(this);
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
				Common._.each(Rank, function(rank){ 
					if(rank.isJoker()){
						cards.add(Cards.joker(rank));
					}
				});
				Common._.each(Rank, function(rank){
					if(!rank.isJoker()){
						cards.add(Cards.heart(rank));
						cards.add(Cards.spade(rank));
						cards.add(Cards.diamond(rank));
						cards.add(Cards.club(rank));
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
				Common._.each(initialCards, function(card){
					cards.add(card);
				});
			}
			else{
				cards.add(initialCards);	
			}
			return cards;
		}, 
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
	return Cards;
});