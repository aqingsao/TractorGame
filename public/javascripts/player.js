var Card = require('./card.js').Card, 
Backbone = require('backbone'),
_=require('underscore')._;

var Player = Backbone.Model.extend({
	initialize: function(){
		this.cards = Card.cards();
	}, 
	hasCards: function(cards){ 
		var that = this;
		_.each(cards, function(card){
			if(!that.cards.contains(card)){
				return false;
			}
		});
		return true;
	}, 
	deal: function(card){
		this.cards.add(card);
	}, 
	equals: function(another){
		return this.get("name") == another.get("name");
	}, 
	canFlip: function(){
		return this.cards.canFlip();
	}, 
	sortedCards: function(){
		return this.cards.sortBy(function(card){
			return card.rank.value;
		});
	}
});
var Pair = Backbone.Model.extend({
	initialize: function(name, seat0, seat1){
		this.name = name;
		this.seats = new Backbone.Collection();
		this.seats.add(seat0);
		this.seats.add(seat1);
		this.isDefenders = false;
		this.isAttackers = false;
	}, 
	hasPlayer: function(player){
		return this.seats.any(function(seat){
			return seat.player.equals(player);
		});
	}, 
	setDefender: function(isDefenders){
		this.isDefenders = isDefenders;
		this.isAttackers = !isDefenders;
	}, 
	rank: function(){
		return this.seats.at(0).rank;
	}
});

exports.Player = Player;
exports.Pair = Pair;
