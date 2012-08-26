define(['common', 'app/cards'], function(Common, Cards){
	var Flipping = Common.Backbone.Model.extend({
		initialize: function(player, cards, currentRank){     
		 	var jokers = Cards.cards(cards.filter(function(card){return card.isJoker();}));
		 	var trumps = Cards.cards(cards.reject(function(card){return card.isJoker();})); 
		
		 	this.set({jokers: jokers, trumps: trumps, banker: player, currentRank: currentRank}); 
			this.check(this.get('jokers'), this.get('trumps'), this.get('currentRank'));
		 }, 
		 isValid: function(){ 
		 	return this.valid;
		 }, 
		 check: function(jokers, trumps, currentRank){
		 	if(jokers.size() == 0 || jokers.size > 2 || trumps.size() > 2){
		 		this.valid = false;  
		 		return;
		 	}
		 	if(jokers.size() == 1){
		 		if(trumps.size() == 0){
		 			this.valid = false; 
		 			return;
		 		}          
		
		 		if(trumps.size() == 1){
		 			if(jokers.at(0).isSmallJoker() && trumps.at(0).isBlackSuit() ){
		 				this.valid = false;
		 			}
		 			else if(jokers.at(0).isBigJoker() && trumps.at(0).isRedSuit() ){
		 				this.valid = false; 
		 			}
		 			else if(currentRank != undefined && !trumps.at(0).rank.equals(currentRank)){
		 				this.valid = false; 
		 			} 
		 			else{   
		 				this.valid = true; 
		 				this.level = 1;
		 			}
		 		}
		 	   	else{
		 			if(!trumps.at(0).equals(trumps.at(1))){
		 				this.valid = false;   
		 			}       
		 			else if(jokers.at(0).isSmallJoker() && trumps.at(0).isBlackSuit() ){
		 				this.valid = false;				
		 			}
		 			else if(jokers.at(0).isBigJoker() && trumps.at(0).isRedSuit() ){
		 				this.valid = false;  
		 			} 
		 			else if(currentRank != undefined && !trumps.at(0).rank.equals(currentRank)){
		 				this.valid = false; 
		 			} 
		 			else{
		 				this.valid = true;
		 				this.level = 2;
		 			}
		 		}
		 	}
		 	else{// 2 jokers
		 		if(!jokers.at(0).equals(jokers.at(1))){
		 			this.valid = false;
		 		}
		 		else if(trumps.size() > 0){
		 			this.valid = false;
		 		}
		 		else{
		 			if(jokers.at(0).isSmallJoker()){
		 				this.valid = true;
		 				this.level = 5;   // 2 small jokers
		 			}
		 			else{
		 				this.valid = true;
		 				this.level = 10; //2 big jokers
		 			}
		 		}  
		 	}
		 }, 
		 canOverturn: function(flipping){
		 	return this.level > flipping.level;
		 }
	 });
	return Flipping;
});