var Backbone = require('backbone'), _ = require('underscore')._, util = require('util');

Backbone.Model = Backbone.Model.extend({
	xport: function(){console.log("...xport...")}
});
var Book = Backbone.Model.extend({});
var book = new Book();
console.log('___' + util.inspect(book.constructor));
book.xport();
