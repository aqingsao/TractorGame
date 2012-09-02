define(['jQuery', 'underscore', 'backbone', 'app/rooms', 'app/room'], function($, _, Backbone, Rooms, Room){	          
	var RoomView = Backbone.View.extend({
		tagName:  "div",           
	  	className: 'room',
	  	template: _.template("<span><a href='/rooms/<%= model.id%>'>room <%= model.id %></a></span><span class='description'><%=model.availableSeats() %> seats available</span><span class='status'><%= model.get('roomState').name%></span>"),
		initialize: function(){
			_.bindAll(this, 'render'); 
		},
		events: {
			"click a": 'showRoom'
		},
		showRoom: function(){
			
		},
	  	render: function() {                 
		 	this.$el.attr("id", "room" + this.model.id);
	    	this.$el.html(this.template({model: this.model}));
	    	return this;
	  	}
	}); 
	var RoomsView = Backbone.View.extend({
	  	el: $("#main"),  
		
	  	initialize: function() {  
			_.bindAll(this, 'render', 'roomAdded'); 

			this.model = new Rooms();
			this.model.bind("add", this.roomAdded) ;
			var self = this;
			$.get("/data/rooms", function(data){
				for(var i = 0; i < data.length; i++){
					console.log(data[i]);
					 
					var room = Room.fjod(data[i]);
					self.model.add(room);
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