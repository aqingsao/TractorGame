define(['backbone', 'underscore', ], function(Backbone, _){ 
	var Suit = Backbone.Model.extend({  
		equals: function(other){
			return this.get('name') == other.get('name');
		},
		isJoker: function(){
			return "Joker" == this.get('name');
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
	});
	return {H: new Suit({name: 'HEART'}), S: new Suit({name: "SPADE"}), D: new Suit({name: "DIAMOND"}), C: new Suit({name: "CLUB"}), J: new Suit({name: "Joker"})}
});