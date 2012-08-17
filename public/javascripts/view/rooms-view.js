$(function(){  
	$.get("/data/rooms", function(data){
		var rooms = JSON.parse(data);
		alert(rooms);
	});
	$(".newRoom").click(function(){
		var form = $(this);                      
		$.post($(this).attr("action"), function(data){
			 alert("create room successfully with room id ");
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