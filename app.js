
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , io = require("socket.io")
  , util = require('util')
  , broader = require('./model/broader.js').Broader;

var app = module.exports = express.createServer(), 
	io = io.listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/tractor/:id', routes.tractor);
app.get('/books', routes.books);
app.post('/tractor/:id/join/:seatId', routes.tractorJoin);
app.post('/tractor/:id/start', routes.tractorStart);
app.post('/tractor/:id/flip', routes.tractorFlip);


app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
       
broader.init(io);