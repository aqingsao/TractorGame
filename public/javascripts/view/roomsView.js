define(['jQuery', 'underscore', 'backbone', 'ejs', 'app/rooms', 'app/room'], function($, _, Backbone, EJS, Rooms, Room){	
	var RoomView = Backbone.View.extend({
		tagName:  "div",           
	  	className: 'room',
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
	    	this.$el.html(new EJS({url: 'templates/room.ejs'}).render({room: this.model}));
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
});