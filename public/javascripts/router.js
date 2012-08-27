define(['jQuery', 'underscore', 'backbone', 'view/rooms'], function($, _, Backbone, RoomsView){
	var AppRouter = Backbone.Router.extend({
		routes:{
			'rooms': 'index', 
			
		},
		index: function(){
			new RoomsView().render();
		},
		start: function(){
			var result = Backbone.history.start({pushState: true, root: "/"}); 
			if(!result){
				console.log("failed to start backbone history.");
			}
		}
	});
	Backbone.sync('read', {}, function(){
		console.log(arguments);
	})
	return new AppRouter;
});
