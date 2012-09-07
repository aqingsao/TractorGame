define(['jQuery', 'underscore', 'backbone', 'ejs', 'app/rooms', 'app/room'], function($, _, Backbone, EJS, Rooms, Room){	          
	var SeatView = Backbone.View.extend({
		el: $(".seat"),
		initialize: function(room){
			this.room = room;
			this.model = this.room.get("seats").getSeat(this.direction);
			_.bindAll(this, 'render', 'tryToTakeSeat'); 
		},
		events:{
			'click .takeSeat': 'tryToTakeSeat'
		},
		render: function(){
		 	var result = new EJS({url: '/templates/seat.ejs'}).render({seat: this.model, room: this.room});
		 	this.$el.attr("id", "seat" + this.model.id);
		 	if(!this.model.isTaken()){
		 		this.$el.addClass('notTaken');
		 	}
		 	else{
		 		this.$el.removeClass('notTaken');
		 	}
		 	this.$el.html(result);
		}
	});
	var PairSeatView = SeatView.extend({
		el: $(".seat.north"), 
		direction: 'north'
	});
	var MySeatView = SeatView.extend({
		el: $(".seat.south"),
		direction: 'south'
	});
	var RightEnemyView = SeatView.extend({
		el: $(".seat.east"),
		direction: 'east'
	});
	var LeftEnemyView = SeatView.extend({
		el: $(".seat.west"),
		direction: 'west'
	});
	var RoomView = Backbone.View.extend({
		el: $(".room"),
	  	initialize: function(roomId){
			_.bindAll(this, 'render'); 
			var self = this;
			$.get("/data/room/" + roomId, function(data){
				console.log(data);
				self.model = Room.fjod(data);
				console.log(self.model);
				self.render();
			});
		},
		events: {
		},
	  	render: function() {                
		 	this.$el.attr("id", "room" + this.model.id);
		 	new PairSeatView(this.model).render();
		 	new LeftEnemyView(this.model).render();
		 	new RightEnemyView(this.model).render();
		 	new MySeatView(this.model).render();
	    	return this;
	  	}
	}); 
	return RoomView;
});