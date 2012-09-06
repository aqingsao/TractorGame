require.config({
	baseUrl: "/javascripts", 
	paths: {
		jQuery: '/javascripts/lib/jquery-1.7.2.min', 
		underscore: '/javascripts/lib/underscore',
		backbone: '/javascripts/lib/backbone', 
		ejs: '/javascripts/lib/ejs'
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
		}, 
		'ejs': {
			exports: 'EJS'
		}
	}
}); 
require(['jQuery', 'underscore', 'backbone', 'ejs', 'router'], function($, _, Backbone, EJS, router){  
	var isLoaded = function(module){
		if(typeof(module) == undefined){
			console.log("Module " + module + " is not loaded.");
			return false;
		}                
		return true;
	};
	if(isLoaded($) && isLoaded(_) && isLoaded(Backbone) && isLoaded(router)&& isLoaded(EJS)){
		console.log("all modules are loaded successfully.");
	}
	router.start();          
});