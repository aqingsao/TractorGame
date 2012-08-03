var Backbone = require('backbone'), 
	_ = require('underscore')._, 
	Card = require('./card.js').Card;

var Flipping = Backbone.Model.extend({
	initialize: function(player, jokers, trumps){
		this.level = this.check(player, jokers, trumps);
		if(this.level < 0){
			this.isValid = false;
		}
		else{
			this.isValid = true;
		}
		if(jokers.size() == 2){
			this.rank = jokers.at(0).rank;
		}
		else if(trumps.size() > 0){
			this.rank = trumps.at(0).rank;
		}
		this.banker = player;
		this.jokers = jokers;
		this.trumps = trumps;
	},
	check: function(player, jokers, trumps){
		if(jokers.size() == 0 || jokers.size > 2 || trumps.size() > 2){
			return -1;
		}
		if(jokers.size() == 1){
			if(trumps.size() == 0){
				return -1;
			}
			if(trumps.size() == 1){
				if(jokers.at(0).isSmallJoker() && trumps.at(0).isBlackSuit() ){
					return -1;
				}
				if(jokers.at(0).isBigJoker() && trumps.at(0).isRedSuit() ){
					return -1;
				}
				return 1;
			}
			if(!trumps.at(0).equals(trumps.at(1))){
				return -1;
			}
			if(jokers.at(0).isSmallJoker() && trumps.at(0).isBlackSuit() ){
				return -1;
			}
			if(jokers.at(0).isBigJoker() && trumps.at(0).isRedSuit() ){
				return -1;
			}
			return 2;
		}
		if(!jokers.at(0).equals(jokers.at(1))){
			return -1;
		}
		if(trumps.size() > 0){
			return -1;
		}
		if(jokers.at(0).isSmallJoker()){
			return 5;
		}
		// 2 jokers are big jokers;
		return 10;
	}, 
	matchRank: function(pair){
		return this.rank == Card.Ranks.SMALL_JOKER || this.rank == Card.Ranks.BIG_JOKER || this.rank == pair.rank();
	}
});
exports.Flipping = Flipping;