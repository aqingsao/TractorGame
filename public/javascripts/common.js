define(function(require, exports, module){ 
	if(typeof(requirejs.nodeRequire) == 'function'){
		var r2 = requirejs.nodeRequire;
		var _ = r2("underscore");
		var util = r2("util");    
	}
	else{
		var r2 = require;  
		var _ = r2("underscore");
		var util = {};    
	}
	return { 
		Backbone: r2('backbone'),
		_: _,              
		util: util
	};
});