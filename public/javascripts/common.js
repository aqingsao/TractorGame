define(function(require, exports, module){ 
	if(typeof(require.nodeRequire) == 'function'){
		var r2 = require.nodeRequire;
		var Backbone = r2('backbone');
		var _ = r2("underscore");
		// var util = r2("util");    
	}
	else{
		var r2 = require;  
		var Backbone = r2('backbone');
		var _ = r2("underscore");
		// var util = r2("util");    
	}
	return { 
		Backbone: Backbone,
		_: _,              
		util: {}
	};
});