require.config({
	baseUrl: "/javascripts", 
	paths: {
		jquery: '/javascripts/lib/jquery-1.7.2.min'
	}, 
	shim: {
		'underscore': {
			exports: '_'
		}, 
		'backbone': {
			exports: 'Backbone'
		},
		'util': {
			exports: 'util'
		},
		'common': {
			exports: 'Common'
		}
	}
}); 
require(['jquery', 'underscore', 'backbone', 'app/rooms'], function($, _, Backbone, Rooms){
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
	  	el: $(".rooms"),  
		
	  	initialize: function() {  
			this.count = $(".count");
			_.bindAll(this, 'render', 'addRoom'); 
			this.model.bind("add", this.addRoom); 
			this.render();
	  	}, 
	  	addRoom: function(room){
			var roomView = new RoomView({model: room});
			$(this.el).append(roomView.render().el);
		}, 
		render: function(){
			var self = this; 
			console.log("_____" + this.model.length);
			_.each(this.model, function(room){
				self.addRoom(room);
			});
		}
	}); 
	
	var rooms = new Rooms();
	Backbone.sync();
	$.get("/data/rooms", function(data){  
		console.log("Get rooms data: " + data);	 
		rooms = rooms.mport(data);
		console.log("Get rooms: " + rooms);	 
		var roomsView = new RoomsView({model: rooms});
	});
	$(".newRoom").click(function(){
		var form = $(this);                      
		$.post($(this).attr("action"), function(data){
			console.log("Create room successfully: " + data.id); 
			rooms.add(new Backbone.Model().mport(data));
		}).error(function(data){
			$(".message.error").removeClass("hidden");
		});	
		return false;
	});
});