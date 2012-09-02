define(['jQuery', 'underscore', 'backbone', 'view/rooms'], function($, _, Backbone, RoomsView){
	var AppRouter = Backbone.Router.extend({
		routes:{
			'rooms': 'roomsIndex', 
			'rooms/:roomId': 'showRoom'
		},
		roomsIndex: function(){
			new RoomsView().render();
		},                            
		showRoom: function(roomId){
			alert('show room ' + roomId);
		},
		start: function(){
			var result = Backbone.history.start({pushState: true, root: "/"}); 
			if(!result){
				console.log("failed to start backbone history.");
			}
		}
	});
	return new AppRouter;
});
