define(['jQuery', 'underscore', 'backbone', 'ejs', 'app/rooms', 'app/room'], function($, _, Backbone, EJS, Rooms, Room){	          
	var SeatView = Backbone.View.extend({
		initialize: function(room, direction){
			this.room = room;
			this.model = this.room.get("seats").getSeat(direction);
			this.el = $(".seat." + direction);
			_.bindAll(this, 'render'); 
		},
		render: function(){
		 	var result = new EJS({url: '/templates/seat.ejs'}).render({seat: this.model, room: this.room});
		 	this.el.html(result);
		}
	});
	var RoomView = Backbone.View.extend({
		el: $(".room"),
	  	initialize: function(roomId){
			_.bindAll(this, 'render'); 
			var self = this;
			$.get("/data/room/" + roomId, function(data){
				console.log(data);
				self.model = Room.fjod(data);
				self.render();
			});
		},
		events: {
		},
	  	render: function() {                
		 	this.$el.attr("id", "room" + this.model.id);
		 	new SeatView(this.model, 'north').render();
		 	new SeatView(this.model, 'west').render();
		 	new SeatView(this.model, 'east').render();
		 	new SeatView(this.model, 'south').render();
	    	return this;
	  	}
	}); 
	return RoomView;
});