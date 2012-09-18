define(['jQuery', 'underscore', 'backbone', 'ejs', 'app/rooms', 'app/room', 'app/player', 'io'], function($, _, Backbone, EJS, Rooms, Room, Player, io){	          	
	var socket = io.connect("ws://" + window.location.host);
  	socket.on("seatChanged", function(data){ 
  		console.log("seat changed");
  		console.log(data);
	});

	var SeatView = Backbone.View.extend({
		mySeat: false,
		initialize: function(roomId, seat){
			this.roomId = roomId;
			this.model = seat;
			_.bindAll(this, 'render'); 
		},
		render: function(){
		 	var result = new EJS({url: '/templates/room/seat.ejs'}).render({seat: this.model, roomId: this.roomId, mySeat: this.mySeat});
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
	var NorthSeatView = SeatView.extend({
		el: $(".seat.north")
	});
	var SouthSeatView = SeatView.extend({
		el: $(".seat.south"),
		mySeat: true
	});
	var EastSeatView = SeatView.extend({
		el: $(".seat.east")
	});
	var WestSeatView = SeatView.extend({
		el: $(".seat.west")
	});
	var getSeat = function(seatId){
		return seatId % 4;
	}
	var room = new Room();
	var RoomView = Backbone.View.extend({
		el: $(".room"),
	  	initialize: function(roomId){
			_.bindAll(this, 'render'); 
			var self = this;
			$.get("/data/room/" + roomId, function(data){
				console.log("I am on seat " + data.mySeat +" in room " + data.room.id);
				self.model = room.fjod(data.room);
				self.mySeat = new Number(data.mySeat);

				self.render();
			});
		},
	  	render: function() {                
		 	this.$el.attr("id", "room" + this.model.id);
		 	
		 	new NorthSeatView(this.model.id, this.model.getSeat(this.mySeat + 2)).render();
		 	new WestSeatView(this.model.id, this.model.getSeat(this.mySeat + 3)).render();
		 	new EastSeatView(this.model.id, this.model.getSeat(this.mySeat + 1)).render();
		 	console.log(this.mySeat);
		 	console.log(this.model.get('seats'));
		 	console.log(this.model.getSeat(this.mySeat + 0));
		 	new SouthSeatView(this.model.id, this.model.getSeat(this.mySeat + 0)).render();
	    	return this;
	  	}, 
	  	init: function(){
	  		this.model = room;
	  	}

	}); 
	return RoomView;
});