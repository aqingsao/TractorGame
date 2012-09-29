define(['backbone', 'underscore', 'app/rank', 'app/pair', 'app/player', 'app/card', 'app/cards', 'app/flipping'], function(Backbone, _, Rank, Pair, Player, Card, Cards, Flipping){
	var Seat = Backbone.Model.extend({
		initialize: function(){
			this.set({rank: Rank.TWO, defender: false, attacker: false, cards: Cards.cards()});
		},	                         
		setDefender: function(currentRank){
			this.set({defender: true, attacker: false});
		}, 
		setAttacker: function(currentRank){
			this.set({defender: false, attacker: true});
		}, 
		join: function(player){
			if(this.isTaken()){   
				console.log("Seat cannot be taken as " + this.get("id") + " is already taken by " + this.get('player').get("name"));
				throw "Cannot take seat";
			}
			console.log("Seat " + this.get("id") + " is taken by " + player.get("name"));
			this.set({player: player});
		}, 
		isTaken: function(){
			return this.get('player') != undefined;
		}, 
		playerName: function(){   
			return this.get('player') == undefined ? "" : this.get('player').get("name");
		}, 
		takenByPlayer: function(player){
			return player.get('name') == this.playerName();
		}, 
		hasCards: function(cards){ 
			var that = this; 
		    return  cards.all(function(card){
				return that.get('cards').contains(card);
			});
		}, 
		deal: function(card){
			this.get('cards').add(card);
		}, 
		canFlip: function(cids, rank){
			var cards = this.get('cards').getCardsByCid(cids);
			return new Flipping({currentRank: rank, jokers: cards.jokers(), trumps: cards.trumps()}).valid();
		}, 
		sortedCards: function(){
			return this.get('cards').sortBy(function(card){
				return card.isJoker();
			});
		}, 
		fjod: function(json){
			var attributes = {};
			if(json.player != undefined){
				attributes['player'] = this.get('player') == undefined? Player.fjod(json.player) : this.get('player').fjod(json.player);
			}
			this.set(attributes);
		}
	}, {
		fjod: function(json){
			var seat = new Seat();
			seat.id= json.id;

			seat.set({id: json.id, rank: json.rank, defender: json.defender, attacker: json.attacker, cards: Cards.fjod(json.cards), player: Player.fjod(json.player)});
			return seat;
		}
	}); 
	return Seat;
});
