var requirejs = require('requirejs');
requirejs.config({
	baseUrl: 'public/javascripts'
}); 
requirejs(['common'], function(Common){
	var Book = Common.Backbone.Model.extend({
		initialize: function(name, pages){
			this.set('name', name);
			this.set({pages: pages});
		}
	});
	exports['Book equals'] = function(test){  
		console.log("" + Common._.isArray(new Common.Backbone.Collection([new Book('', 200)])));
		test.done();
	};
});
