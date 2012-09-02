define(['jQuery', 'underscore', 'backbone', 'app/rooms', 'app/room'], function($, _, Backbone, Rooms, Room){	          
	var RoomView = Backbone.View.extend({
		tagName:  "div",           
	  	className: 'room',
	  	template: _.template("<span.roomId>room <%= model.id %></span><span.status><%= model.roomState></span>"),
	  	render: function() { 
	    	this.$el.html(this.template({model: this.model}));
	    	return this;
	  	}
	}); 
	var RoomsView = Backbone.View.extend({
	  	el: $("#main"),  
		
	  	initialize: function() {  
			_.bindAll(this, 'render', 'addRoom'); 

			this.model = new Rooms();
			this.model.bind("add", this.addRoom) ;
			this.model.bind("change", this.updateRoom) ;
			var self = this;
			$.get("/data/rooms", function(data){
				for(var i = 0; i < data.length; i++){
					var room = new Room(); 
					self.model.add(room);
				}
			});
			console.log("Rooms count " + self.model.length);
			self.render();
	  	},
	 	events: {
			"click .newRoom": 'createRoom'
		},                               
		createRoom: function(){  
			console.log("create new room...");
			console.log(arguments);
			var form = this.$(".newRoom");                      
			$.post(form.attr("action"), form.serialize(), function(data){ 
		   		rooms.add(Room.fromJSON(data));
			}).error(function(data){
			    gameStartError(data);
			});	
			return false;
		}
	  	addRoom: function(room){   
			var roomView = new RoomView({model: room});
			this.$(".rooms").append(roomView.render().el); 
			this.$(".count").text(this.$(".count").text() + 1);
		},
		updateRoom: function(room){
			console.log("Room has been changed");
		}, 
		render: function(){
		}
	}); 
	return RoomsView;
	
	// $.get("/data/rooms", function(data){  
	// 	var roomsView = new RoomsView({model: rooms});
	// });
	// $(".newRoom").click(function(){
	// 	var form = $(this);                      
	// 	$.post($(this).attr("action"), function(data){
	// 		rooms.add(new Backbone.Model().mport(data));
	// 	}).error(function(data){
	// 		$(".message.error").removeClass("hidden");
	// 	});	
	// 	return false;
	// });
});