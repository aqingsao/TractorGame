$(function(){
	$(".newRoom").click(function(){
		var form = $(this);                      
		$.post($(this).attr("action"), function(data){
			 
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

 // The Application
 // ---------------

 // Our overall **AppView** is the top-level piece of UI.
 var AppView = Backbone.View.extend({

   // Instead of generating a new element, bind to the existing skeleton of
   // the App already present in the HTML.
   el: $(".rooms"),

   // Our template for the line of statistics at the bottom of the app.
   roomsTemplate: _.template($('#rooms-template').html()),
   
   // At initialization we bind to the relevant events on the `Todos`
   // collection, when items are added or changed. Kick things off by
   // loading any preexisting todos that might be saved in *localStorage*.
   initialize: function() {
     
   },

   // Re-rendering the App just means refreshing the statistics -- the rest
   // of the app doesn't change.
   render: function() {
     
   }
 });

 // Finally, we kick things off by creating the **App**.
 var App = new AppView;