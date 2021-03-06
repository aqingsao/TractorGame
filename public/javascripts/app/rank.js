define(['backbone', 'underscore'], function(Backbone, _){ 
	var Rank = Backbone.Model.extend({ 
		initialize: function(name, weight, point){
			this.set({name: name, weight: weight, point: point});
		},  
		isJoker: function(){
			 return this.get('name') == 'Small' || this.get('name') == 'Big';
		},
		equals: function(other){
			return this.get('name') == other.get('name') && this.get('weight') == other.get('weight');
		},
		matchSuit: function(suit){
			return (suit.isJoker() && this.isJoker()) || (!suit.isJoker() && !this.isJoker());
		},
		toString: function(){
			return this.get("name");
		}
	});
	return {
		TWO: new Rank('2', 2, 0), THREE: new Rank('3', 3, 0), FOUR: new Rank('4', 4, 0), FIVE: new Rank('5', 5, 5), 
			SIX: new Rank('6', 6, 0), SEVEN: new Rank('7', 7, 0), EIGHT: new Rank('8', 8, 0), NINE: new Rank('9', 9, 0), TEN: new Rank('10', 10, 10), 
			JACK: new Rank('J', 11, 0), QUEEN: new Rank('Q', 12, 0), KING: new Rank('K', 13, 10), ACE: new Rank('A', 14, 0), 
			SMALL_JOKER: new Rank('Small', 300, 0), BIG_JOKER: new Rank('Big', 500, 0)
			, fjod: function(json){
				switch(json.name){
					case '2':
						return this.TWO;
					case '3':
						return this.THREE;
					case '4':
						return this.FOUR;
					case '5':
						return this.FIVE;
					case '6':
						return this.SIX;
					case '7':
						return this.SEVEN;
					case '8':
						return this.EIGHT;
					case '9':
						return this.NINE;
					case '10':
						return this.TEN;
					case 'J':
						return this.JACK;
					case 'Q':
						return this.QUEEN;
					case 'K':
						return this.KING;
					case 'A':
						return this.ACE;
					case 'Small':
						return this.SMALL_JOKER;
					case 'Big':
						return this.BIG_JOKER;
					default:
						throw "illegal roomState name " + json.name;
				}
			}
	};
});