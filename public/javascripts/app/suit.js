define(['common'], function(Common){ 
	var Suit = Common.Backbone.Model.extend({  
		equals: function(other){
			return this.get('name') == other.get('name');
		},
		isJoker: function(){
			return "Joker" == this.get('name');
		}
	});
	return {H: new Suit({name: 'HEART'}), S: new Suit({name: "SPADE"}), D: new Suit({name: "DIAMOND"}), C: new Suit({name: "CLUB"}), J: new Suit({name: "Joker"})}
});