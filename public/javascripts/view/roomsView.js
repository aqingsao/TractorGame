define(['jQuery', 'underscore', 'backbone', 'ejs', 'app/rooms', 'app/room', 'io'], function($, _, Backbone, EJS, Rooms, Room, io){	
	var othersTakeSeat = function(roomId, seatId, player){
		console.log("Player " + player + " take seat " + seatId + " in room " + roomId);
   		var seat = $("#room" + roomId +"seat" + seatId);
		seat.addClass("others").removeClass("notTaken");  
		takeSeat(seat, player);
	};

	var socket = io.connect("ws://" + window.location.host);
  	socket.on("roomChanged", function(data){ 
  		console.log("room " + data.roomId + " changed ...");
  		var room = rooms.get(data.roomId);
  		if(room != undefined){
			room.fjod(data.changed);		
  		}
	});
  	socket.on("seatChanged", function(data){ 
  		console.log("room " + data.roomId + " seat " + data.seatId + " changed ...");
  		var room = rooms.get(data.roomId);
  		if(room != undefined && room.getSeat(data.seatId) != undefined){
			room.getSeat(data.seatId).fjod(data.changed);
  		}
	});

	var SeatView = Backbone.View.extend({
		tagName: 'div',
		className: 'roomSeat',
		initialize: function(roomId, seat){
			this.roomId =roomId;
			this.model = seat;
			var self = this;
			this.model.on("change", function(){self.render();});
			_.bindAll(this, 'render'); 
		},
		events: {
			"click .join": 'tryToTakeSeat'
		},
		tryToTakeSeat: function(){
			var self = this;
			var form = this.$el.find(".join");                      
			$.post(form.attr("action"), form.serialize(), function(data){ 
				var seatId = self.model.id;
				var playerName = form.find(".name").val();  
				if(typeof(data.redirect) == 'string'){
                    window.location = data.redirect
				}
			}).error(function(data){
				self.$el.find(".message.error").removeClass("hidden");
			});	
			return false;
		},
		iTakeSeat: function(seatId, playerName){ 
			console.log("I take seat " + seatId + " in room " + this.roomId);
			this.$el.find("span.name").text(playerName).removeClass("hidden");
			this.$el.find('.join').addClass("hidden");
		},
		render: function(){
	    	this.$el.html(new EJS({url: 'templates/rooms/seat.ejs'}).render({roomId: this.roomId, seat: this.model}));
	    	this.$el.attr("id", "room"+this.roomId+"seat"+this.model.id);
	    	return this;
		}
	});
	var RoomView = Backbone.View.extend({
		tagName:  "div",           
	  	className: 'room',
		initialize: function(){
			var self = this;
			this.model.on('change', function(){self.render();});
			_.bindAll(this, 'render'); 
		},
		events: {
			"click a": 'showRoom'
		},
		showRoom: function(){
			
		},
	  	render: function() {        
		 	this.$el.attr("id", "room" + this.model.id);
	  		this.$el.html(new EJS({url: 'templates/rooms/room.ejs'}).render({room: this.model}));
	    	
	    	this.$el.find(".topSeat").html(new SeatView(this.model.id, this.model.get("seats").at(0)).render().el);
	    	this.$el.find(".leftSeat").html(new SeatView(this.model.id, this.model.get("seats").at(1)).render().el);
	    	this.$el.find(".rightSeat").html(new SeatView(this.model.id, this.model.get("seats").at(3)).render().el);
	    	this.$el.find(".bottomSeat").html(new SeatView(this.model.id, this.model.get("seats").at(2)).render().el);
	    	return this;
	  	}
	}); 
	var rooms = new Rooms();
	var RoomsView = Backbone.View.extend({
	  	el: $("#main"),  
		
	  	initialize: function() {  
			_.bindAll(this, 'render', 'roomAdded'); 
			this.model = rooms;
			var self = this;
			$.get("/data/rooms", function(data){
				console.log("Initially there are " + data.length +" rooms.");
				for(var i = 0; i < data.length; i++){	
					var room = Room.fjod(data[i]);
					console.log(room);
					rooms.add(room);
				}
			});
			self.render();
	  	},
	 	events: {
			"click .newRoom": 'createRoom'
		},                               
		createRoom: function(){  
			var form = this.$(".newRoom"); 
			var self = this;                     
			$.post(form.attr("action"), function(data){ 
		   		self.model.add(Room.fjod(data));
		   		self.$(".message.error").hide();
			}).error(function(data){
			    self.$(".message.error").show();
			});	
			return false;
		},
	  	roomAdded: function(room){   
			var roomView = new RoomView({model: room});
			this.$(".rooms").append(roomView.render().el); 
			this.$(".count").text(this.model.length);
		}, 
		render: function(){
		}, 
		init: function(){
			this.model = rooms;
			this.model.bind("add", this.roomAdded);
		}
	}); 
	return RoomsView;
});