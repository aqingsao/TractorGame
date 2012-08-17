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
	$.get("/data/rooms", function(data){
		$(".count").text(data.length);
		
	});
	$(".newRoom").click(function(){
		var form = $(this);                      
		$.post($(this).attr("action"), function(data){
			 $(".count").text($('.count').text() + 1);
		}).error(function(data){
			$(".message.error").removeClass("hidden");
		});	
		return false;
	});
});
// The DOM element for a todo item...
 var RoomView = Backbone.View.extend({

   //... is a list tag.
   tagName:  "li",

   // Cache the template function for a single item.
   template: _.template($('#room-template').html()),

   // The DOM events specific to an item.
   events: {
   },

   initialize: function() {
     this.model.bind('change', this.render, this);
     this.model.bind('destroy', this.remove, this);
   },

   // Re-render the titles of the todo item.
   render: function() {
     this.$el.html(this.template(this.model.toJSON()));
     return this;
   }
 });
 var AppView = Backbone.View.extend({
   el: $(".rooms"),
   roomsTemplate: _.template($('#rooms-template').html()),
   initialize: function() {
     
   },
   render: function() {
     
   }
 });

 // var App = new AppView;