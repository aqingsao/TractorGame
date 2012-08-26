define(['common', 'app/cards'], function(Common, Cards){
	 var check = function(jokers, trumps, currentRank){
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
	 			else if(jokers.at(0).isBigJoker() && trumps.at(0).isRedSuit() ){
	 				return -1;
	 			}
	 			else if(currentRank != undefined && !trumps.at(0).rank.equals(currentRank)){
	 				return -1;
	 			} 
  				return 1;
	 		}
	 	   	else{
	 			if(!trumps.at(0).equals(trumps.at(1))){
	 				return -1;
	 			}       
	 			else if(jokers.at(0).isSmallJoker() && trumps.at(0).isBlackSuit() ){
	 				return -1;
	 			}
	 			else if(jokers.at(0).isBigJoker() && trumps.at(0).isRedSuit() ){
	 				return -1;
	 			} 
	 			else if(currentRank != undefined && !trumps.at(0).rank.equals(currentRank)){
	 				return -1;
	 			} 
	 			return 2;
	 		}
	 	}
	 	else{// 2 jokers
	 		if(!jokers.at(0).equals(jokers.at(1))){
 				return -1;
	 		}
	 		else if(trumps.size() > 0){
 				return -1;
	 		}
	 		else{
	 			if(jokers.at(0).isSmallJoker()){
	 				return 5;   // 2 small jokers
	 			}
  				return 10; //2 big jokers
	 		}  
	 	}
	 }; 
	
	var Flipping = Common.Backbone.Model.extend({
		initialize: function(player, cards, currentRank){     
		 	var jokers = Cards.cards(cards.filter(function(card){return card.isJoker();}));
		 	var trumps = Cards.cards(cards.reject(function(card){return card.isJoker();})); 
		
		 	this.set({jokers: jokers, trumps: trumps, banker: player, currentRank: currentRank}); 
			this.level = check(this.get('jokers'), this.get('trumps'), this.get('currentRank'));
		 }, 
		 isValid: function(){ 
		 	return this.level > 0;
		 }, 
		 canOverturn: function(flipping){
		 	return this.level > flipping.level;
		 }
	 });
	return Flipping;
});