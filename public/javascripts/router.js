define(['jQuery', 'underscore', 'backbone', 'view/roomsView', 'view/roomView'], function($, _, Backbone, RoomsView, RoomView){
	var AppRouter = Backbone.Router.extend({
		routes:{
			'rooms': 'roomsIndex', 
			'room/:roomId': 'roomShow'
		},
		roomsIndex: function(){
			new RoomsView().init();
		},                            
		roomShow: function(roomId){
			new RoomView(roomId).init();
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
