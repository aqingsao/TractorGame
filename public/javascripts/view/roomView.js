define(['jQuery', 'underscore', 'backbone', 'ejs', 'app/rooms', 'app/room', 'app/player', 'io', 'app/card'], function($, _, Backbone, EJS, Rooms, Room, Player, io, Card){	          	
	var socket = io.connect("ws://" + window.location.host);
  	socket.on("seatChanged", function(data){ 
  		if(room != undefined && room.id == data.roomId && room.getSeat(data.seatId) != undefined){
	  		console.log("room " + data.roomId +" seat " + data.seatId + " changed ...");
			room.getSeat(data.seatId).fjod(data.changed);
  		}
	});
  	socket.on("dealCard", function(data){ 
  		if(room != undefined && room.id == data.roomId && room.getSeat(data.seatId) != undefined){
			room.getSeat(data.seatId).deal(Card.fjod(data.changed));
  		}
	});
  	socket.on("buryCard", function(data){ 
  		if(room != undefined && room.id == data.roomId && room.getSeat(data.seatId) != undefined){
			room.getSeat(data.seatId).playCard(data.changed.id);
  		}
	});
	socket.on("roomChanged", function(data){ 
  		if(room != undefined & room.id == data.roomId){
  			console.log("my room changed ...");
			room.fjod(data.changed);
  		}
	});

	var SeatView = Backbone.View.extend({
		mySeat: false,
		initialize: function(room, seat){
			this.room = room;
			this.model = seat;
			var self = this;
			this.model.on('change', function(){self.render();})
			this.model.get("cards").bind('add', function(){self.render();})
			this.model.get("cards").bind('remove', function(){self.render();})
			_.bindAll(this, 'render', 'flip'); 
		},
		events:{
			"click .card": 'toggleCard', 
			"click .flip": 'flip',
			"click .bury": 'bury'
		},
		toggleCard: function(e){
			$(e.target).toggleClass('selected');
			if(this.room.canFlip()){
				if(this.canFlip()){
					this.$(".flip").removeClass('hidden');
				}
				else{
					this.$(".flip").addClass('hidden');	
				}
			}
			if(this.room.canBury()){
				if(this.canBury()){
					this.$(".bury").removeClass('hidden');
				}
				else{
					this.$(".bury").addClass('hidden');	
				}
			}
		},
		canFlip: function(){
			return this.model.canFlip(this.$(".card.selected").map(function(index, c){return $(c).attr('id')}));
		},
		canBury: function(){
			return this.$(".card.selected").length == 8;
		}, 
		flip: function(){
			var self = this;

			var form = this.$("form.flip");  
			var data = [];
			this.$(".card.selected").each(function(index, c){
				data.push($(c).attr('id'));
			});
			$.post(form.attr("action"), {'cards': data}, function(data){ 
	   			console.log("Flip successfully.") 
			}).error(function(data){
				console.log("Failed to flip: " + data);
		    	self.render();
			});	
			return false;
		}, 
		bury: function(){
			var self = this;

			var form = this.$("form.bury");  
			var data = [];
			this.$(".card.selected").each(function(index, c){
				data.push($(c).attr('id'));
			});
			$.post(form.attr("action"), {'cards': data}, function(data){ 
	   			console.log("Bury successfully.") 
			}).error(function(data){
				console.log("Failed to bury: " + data);
		    	self.render();
			});
			return false;
		}, 
		render: function(){
		 	var result = new EJS({url: '/templates/room/seat.ejs'}).render({seat: this.model, roomId: this.room.id, mySeat: this.mySeat});
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
	var room;
	var RoomView = Backbone.View.extend({
		el: $(".playarea"),
	  	initialize: function(roomId){
			_.bindAll(this, 'render', 'startGame'); 
			var self = this;
			$.get("/data/room/" + roomId, function(data){
				console.log("I am on seat " + data.mySeat +" in room " + data.room.id);
				console.log(data);
				if(data.mySeat == undefined){
					data.mySeat = 0;
				}
				room = Room.fjod(data.room);
				self.model = room;
				self.model.on("change", function(){self.render();});
				self.mySeat = new Number(data.mySeat);

				self.render();
				new NorthSeatView(self.model, self.model.getSeat(self.mySeat + 2)).render();
		 		new WestSeatView(self.model, self.model.getSeat(self.mySeat + 3)).render();
		 		new EastSeatView(self.model, self.model.getSeat(self.mySeat + 1)).render();
		 		new SouthSeatView(self.model, self.model.getSeat(self.mySeat + 0)).render();
			});
		},
		events: {
			"click form.start": "startGame"
		},
		startGame: function(){
			var self = this;
			var form = $("form.start");                      
			$.post(form.attr("action"), form.serialize(), function(data){ 
	   			console.log("game started.") 
			}).error(function(data){
				console.log("game failed to start.");
		    	self.render();
			});	
			return false;
		},
	  	render: function() {                
	  		console.log(this.model);
		 	var result = new EJS({url: '/templates/room/playarea.ejs'}).render({room: this.model});
		 	this.$el.html(result);
	    	return this;
	  	}, 
	  	init: function(){
	  		this.model = room;
	  	}
	}); 
	return RoomView;
});