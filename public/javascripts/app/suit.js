define(['backbone', 'underscore', ], function(Backbone, _){ 
	var Suit = Backbone.Model.extend({  
		equals: function(other){
			return this.get('name') == other.get('name');
		},
		isJoker: function(){
			return "Joker" == this.get('name');
		}
	});
	return {H: new Suit({name: 'HEART'}), S: new Suit({name: "SPADE"}), D: new Suit({name: "DIAMOND"}), 
	C: new Suit({name: "CLUB"}), SJ: new Suit({name: "SmallJoker"}), BJ: new Suit({name: 'BigJoker'}), 
	fjod: function(json){
		switch(json.name){
			case 'HEART':
			return this.H;
			case 'SPADE':
			return this.S;
			case 'DIAMOND':
			return this.D;
			case 'CLUB':
			return this.C;
			case 'SmallJoker':
			return this.SJ;
			case 'BigJoker':
			return this.BJ;
			default:
			throw 'illegal suit name ' + json.name;
		}
	}}
});