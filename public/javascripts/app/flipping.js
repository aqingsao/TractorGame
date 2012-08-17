define(['common', 'app/cards'], function(Common, Cards){
	var Flipping = function(player, cards, currentRank){     
		var jokers = Cards.cards(cards.filter(function(card){return card.isJoker();}));
		var trumps = Cards.cards(cards.reject(function(card){return card.isJoker();})); 

		this.jokers = jokers;
		this.trumps = trumps;
		this.banker = player;
		this.currentRank = currentRank; 
	};	 
	Flipping.prototype.isValid = function(){ 
		if(this.valid == undefined){
			this.check();
		}
		return this.valid;
	}

	Flipping.prototype.check = function(){
		if(this.jokers.size() == 0 || this.jokers.size > 2 || this.trumps.size() > 2){
			this.valid = false;  
			return;
		}
		if(this.jokers.size() == 1){
			if(this.trumps.size() == 0){
				this.valid = false; 
				return;
			}          

			if(this.trumps.size() == 1){
				if(this.jokers.at(0).isSmallJoker() && this.trumps.at(0).isBlackSuit() ){
					this.valid = false;
				}
				else if(this.jokers.at(0).isBigJoker() && this.trumps.at(0).isRedSuit() ){
					this.valid = false; 
				}
				else if(this.currentRanks != undefined && !this.trumps.at(0).rank.equals(this.currentRank)){
					this.valid = false; 
				} 
				else{   
					this.valid = true; 
					this.level = 1;
				}
			}
		   	else{
				if(!this.trumps.at(0).equals(this.trumps.at(1))){
					this.valid = false;   
				}       
				else if(this.jokers.at(0).isSmallJoker() && this.trumps.at(0).isBlackSuit() ){
					this.valid = false;				
				}
				else if(this.jokers.at(0).isBigJoker() && this.trumps.at(0).isRedSuit() ){
					this.valid = false;  
				} 
				else if(this.currentRanks != undefined && !this.trumps.at(0).rank.equals(this.currentRank)){
					this.valid = false; 
				} 
				else{
					this.valid = true;
					this.level = 2;
				}
			}
		}
		else{// 2 jokers
			if(!this.jokers.at(0).equals(this.jokers.at(1))){
				this.valid = false;
			}
			else if(this.trumps.size() > 0){
				this.valid = false;
			}
			else{
				if(this.jokers.at(0).isSmallJoker()){
					this.valid = true;
					this.level = 5;   // 2 small jokers
				}
				else{
					this.valid = true;
					this.level = 10; //2 big jokers
				}
			}  
		}
	}; 
	Flipping.prototype.canOverturn = function(flipping){
		return this.level > flipping.level;
	}
	return Flipping;
});