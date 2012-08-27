require.config({
	baseUrl: "/javascripts", 
	paths: {
		jQuery: '/javascripts/lib/jquery-1.7.2.min', 
		underScore: '/javascripts/lib/underscore',
		backbone: '/javascripts/backbone'
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
		}, 
		'jQuery': {
			exports: '$'
		}
	}
}); 
require(['jQuery', 'underscore', 'backbone', 'router'], function($, _, Backbone, router){  
	var isLoaded = function(module){
		if(typeof(module) == undefined){
			console.log("Module " + module + " is not loaded.");
			return false;
		}                
		return true;
	};
	if(isLoaded($) && isLoaded(_) && isLoaded(Backbone) && isLoaded(router)){
		console.log("all modules are loaded successfully.");
	}
	router.start();          
});