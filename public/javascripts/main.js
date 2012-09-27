require.config({
	baseUrl: "/javascripts", 
	paths: {
		jQuery: '/javascripts/lib/jquery-1.7.2.min', 
		underscore: '/javascripts/lib/underscore',
		backbone: '/javascripts/lib/backbone', 
		ejs: '/javascripts/lib/ejs',
		io: '/socket.io/socket.io'
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
		},
		'io': {
			exports: 'io'
		}
	}
}); 
try{
	require(['jQuery', 'underscore', 'backbone', 'ejs', 'router', 'io'], function($, _, Backbone, EJS, router, io){  
	var isLoaded = function(module){
		if(module != undefined){
			return true;
		}              
		console.log("At least one module is not loaded successfully");  
		return false;
	};
	if(isLoaded($) && isLoaded(_) && isLoaded(Backbone) && isLoaded(router)&& isLoaded(EJS) && isLoaded(io)){
		console.log("all modules are loaded successfully.");
	};
	if(!("WebSocket" in window)){  
	    alert("No web socket is supported!"); 
		return;
	} 
	var socket = io.connect("ws://" + window.location.host);
  	socket.on('connected', function (data) {
		console.log("WebSocket has been connected with server");  
  	});
  	_.socket = socket; // Temporarily set socket to _, so that we could use it in other modules;


	router.start();          
	});
}catch(e){
	console.log("failed to load javascripts: ");
	console.log(e);
}