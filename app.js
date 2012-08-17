var requirejs = require('requirejs');
requirejs.config({
	baseUrl: 'public/javascripts', 
	paths: {
		routes: 'routes'
	},
	nodeRequire: require
}); 
 
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

requirejs(['express', 'routes/index.js', 'socket.io', 'broader'], function(express, routes, io, broader){
   	var app = module.exports = express.createServer();
	var io = io.listen(app);
  	
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
  	app.get('/rooms', routes.roomsIndex);
  	app.post('/rooms', routes.roomsCreate);
  	app.get('/data/rooms', routes.roomsIndexJson);

  	app.get('/room/:id', routes.room);
  	app.post('/room/:id/join/:seatId', routes.roomJoin);

  	app.post('/room/:id/start', routes.roundStart);
  	app.post('/room/:id/flip', routes.tractorFlip);
  	
  	app.listen(3000, function(){
  	  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
  	});
  	
  	broader.init(io);  
});