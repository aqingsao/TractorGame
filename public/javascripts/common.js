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
	
	var xport = function (opt) {
	    var result = {}, settings = _({ecurse: true}).extend(opt || {});
	    function process(targetObj, source) {
	      targetObj.id = source.id || null;
	      targetObj.cid = source.cid || null;
	      targetObj.attrs = source.toJSON();
		  console.log("___attrs: " + source.toJSON() );
	      _.each(source, function (value, key) { 
	        if (settings.recurse) {
	          if (key !== 'collection' && source[key] instanceof Backbone.Collection) {
	            targetObj.collections = targetObj.collections || {};
	            targetObj.collections[key] = {};
	            targetObj.collections[key].models = [];
	            targetObj.collections[key].id = source[key].id || null;
	            _.each(source[key].models, function (value, index) {
	              process(targetObj.collections[key].models[index] = {}, value);
	            });
	          } else if (source[key] instanceof Backbone.Model) {
	            targetObj.models = targetObj.models || {};
	            process(targetObj.models[key] = {}, value);
	          }
	        }
	      });
	    }
	    process(result, this);
	    return result;
	};
	var mport = function (data, silent) {
	    function process(targetObj, data) {
	      	targetObj.id = data.id || null;
			 
  	      	// targetObj.set(data.attrs, {silent: silent});
	      	if (data.collections) {
	        	_.each(data.collections, function (collection, name) {
	          		targetObj[name].id = collection.id;
	          		Skeleton.models[collection.id] = targetObj[name];
	          		_.each(collection.models, function (modelData, index) {
	            		var newObj = targetObj[name]._add({}, {silent: silent});
	            		process(newObj, modelData);
	          	 	});
	        	});
	      	}
	      	if (data.models) {
	        	_.each(data.models, function (modelData, name) {
	          		process(targetObj[name], modelData);
	        	});
	      	}
	    }
	    process(this, data);
	    return this;
   	};
	Backbone.Model = Backbone.Model.extend({xport: xport, mport: mport}); 
	Backbone.Collection = Backbone.Collection.extend({xport: xport, mport: mport}); 
	return { 
		Backbone: Backbone,
		_: _,              
		util: util
	};
});