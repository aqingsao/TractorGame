define(['backbone', 'underscore', 'app/rank', 'app/card', 'app/cards'], function(Backbone, _, Rank, Card, Cards){
	var Hand = Backbone.Model.extend({
		initialize: function(){

		}
	}, {
		fjod: function(json){
			var hand = new Hand({seatId: json.seatId, cards: Cards.fjod(json.cards)});
			return hand;
		}
	}); 
	return Hand;
});
