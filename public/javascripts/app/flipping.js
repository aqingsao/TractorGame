define(['backbone', 'underscore', 'app/cards'], function(Backbone, _, Cards){
	 var check = function(jokers, trumps, currentRank){
	 	if(jokers.any(function(card){
	 		return !card.isJoker();
	 	}) || trumps.any(function(card){
	 		return card.isJoker();
	 	})){
	 		return -1;
	 	}
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
	 			else if(currentRank != undefined && !trumps.at(0).get("rank").equals(currentRank)){
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
	 			else if(currentRank != undefined && !trumps.at(0).get("rank").equals(currentRank)){
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
	
	var Flipping = Backbone.Model.extend({
		 canOverturn: function(flipping){
		 	return this.level > flipping.level;
		 }, 
		 valid: function(){		
			this.level = check(this.get('jokers'), this.get('trumps'), this.get('currentRank'));
			return this.level > 0;
		 }
	 }, {
	 	fjod: function(json){
	 		if(json == undefined){
	 			return undefined;
	 		}
	 		return new Flipping({banker: Seat.fjod(json.seat), currentRank: RANK.fjod(json.rank), jokers: Cards.fjod(json.jokers), trumps: Cards.fjod(json.trump)});
	 	}
	 });
	return Flipping;
});