define(function(){ 
	var Suit = function(name){
		this.name = name,
		this.equals = function(other){
			return this.name == other.name;
		},
		this.isJoker = function(){
			return "Joker" == this.name;
		}
	};
	return {H: new Suit('HEART'), S: new Suit("SPADE"), D: new Suit("DIAMOND"), C: new Suit("CLUB"), J: new Suit("Joker")}
});