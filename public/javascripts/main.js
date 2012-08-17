require.config({
	baseUrl: "/javascripts", 
	paths: {
	   'backbone': '/javascripts/backbone.js' 
	}, 
	shim: { 
		common: {
			exports: 'Common'
		}
	}
});
