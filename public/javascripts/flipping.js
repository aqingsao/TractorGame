var Backbone = require('backbone'), 
	_ = require('underscore')._, 
	Card = require('./card.js').Card;

var Flipping = function(player, jokers, trumps){
	this.banker = player;
	this.jokers = jokers;
	this.trumps = trumps; 
};	 
Flipping.prototype.isValid = function(){ 
	if(this.level == undefined){
		this.level = this.check();
		if(this.jokers.size() == 2){
			this.rank = this.jokers.at(0).rank;
		}
		else if(this.trumps.size() > 0){
			this.rank = this.trumps.at(0).rank;
		}
	}
	return this.level > 0;
}

Flipping.prototype.check = function(){
	if(this.jokers.size() == 0 || this.jokers.size > 2 || this.trumps.size() > 2){
		return -1;
	}
	if(this.jokers.size() == 1){
		if(this.trumps.size() == 0){
			return -1;
		}
		if(this.trumps.size() == 1){
			if(this.jokers.at(0).isSmallJoker() && this.trumps.at(0).isBlackSuit() ){
				return -1;
			}
			if(this.jokers.at(0).isBigJoker() && this.trumps.at(0).isRedSuit() ){
				return -1;
			}
			return 1;
		}
		if(!this.trumps.at(0).equals(this.trumps.at(1))){
			return -1;
		}
		if(this.jokers.at(0).isSmallJoker() && this.trumps.at(0).isBlackSuit() ){
			return -1;
		}
		if(this.jokers.at(0).isBigJoker() && this.trumps.at(0).isRedSuit() ){
			return -1;
		}
		return 2;
	}
	if(!this.jokers.at(0).equals(this.jokers.at(1))){
		return -1;
	}
	if(this.trumps.size() > 0){
		return -1;
	}
	if(this.jokers.at(0).isSmallJoker()){
		return 5;
	}
	// 2 jokers are big jokers;
	return 10;
}; 
Flipping.prototype.matchRank = function(rank){
	return this.rank == Card.Ranks.SMALL_JOKER || this.rank == Card.Ranks.BIG_JOKER || this.rank == rank;
};
module.exports = Flipping;