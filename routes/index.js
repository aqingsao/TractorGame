define(['util', 'app/cards', 'app/rooms', 'app/room', 'app/player', 'broader'], function(util, Cards, Rooms, Room, Player, broader){
	var rooms = new Rooms();    
	return{
		index: function(req, res){ 
			res.render('index', { title: 'Express' })
		},
		roomsIndex: function(req, res){
			res.render('rooms', {title: 'Rooms'});
		}, 
		roomsIndexJson: function(req, res){			
			console.log("Rooms: " + util.inspect(rooms.toJSON()));
			res.json(rooms.toJSON());
		},
		roomsCreate: function(req, res){
			var id = rooms.length + 1;
			var room = new Room({id: id, dealInterval: 100}); 
			room.id = id;
			rooms.add(room);
			res.json(room.toJSON());
		}, 
		room: function(req, res){
			var id = req.params.id;
			if(id <= 0){
				throw "Illegal room id " + id;
			}        
			var room = rooms.get(id);
			if(room == undefined){
				room = new Room({id: id, dealInterval: 100});
				room.id = id;
				rooms.add(room);
				console.log("create new room " + id);
			}    
			res.render('room', {room: room, title: 'Room ' + id});
		},
		roomJson: function(req, res){
			var room = rooms.get(req.params.id);
			res.json(room == undefined? {} : room.toJSON());
		},
		roomJoin: function(req, res){
			var id = req.params.id;
			var seatId = req.params.seatId;
			var room = rooms.get(id);
			if(room == undefined){
				throw "Invalid room id " + id;
			}
			var player = new Player({name: req.body.name});   
			try{
				console.log("Player " + player.get("name") + "  is joining room " + id + " on seat " + seatId);
				room.join(player, seatId); 
				broader.onJoin(id, seatId, player);
		
				res.json(player.toJSON());
			}catch(error){  
				console.log("Player " + player.get("name") + " failed to join room " + id + " on seat " + seatId +": " + error);
				res.json({error: error}, 400);
			}
		}, 
		roundStart: function(req, res){
			var id = req.params.id;
			var room = rooms.get(id);
			try{
				if(room == undefined){
					throw "Invalid room id " + id;
				}
				room.start();
				console.log("Start game in room " + id);
				res.json({});
			}catch(error){  
				console.log("Failed to start next round in room " + id + ": " + error);
				res.json({error: error, tractorGame: room.toJSON()}, 400);
			}
		},
		tractorFlip: function(req, res){
			var id = req.params.id; 
			var playerName = req.body.name;
			var room = rooms.get(id);
			try{
				if(room == undefined){
					throw "Invalid room id " + id;
				}
				room.flip();
				console.log("Fliping in room " + id);
				res.json({});
			}catch(error){  
				console.log("Failed to flip in room " + id + ": " + error);
				res.json({error: error, tractorGame: room.toJSON()}, 400);
			}
		}
	}	
		
});
	
/*
 * GET home page.
 */

