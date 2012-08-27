define(function(require, exports, module){
	if(typeof(requirejs.nodeRequire) == 'function'){
		var r2 = requirejs.nodeRequire;
		var util = r2("util");
	}else{
		var r2 = require;  
		var util = {};    
	}
	var _ = r2("underscore");
	var Backbone = r2('backbone');
	
	return { 
		Backbone: Backbone,
		_: _,              
		util: util
	};
});