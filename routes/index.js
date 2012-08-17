define(['app/cards', 'app/rooms', 'app/player', 'broader'], function(Cards, Rooms, Player, broader){
	var rooms = new Rooms();
	return{
		roomsIndex: function(req, res){
			res.render('rooms', {title: 'Rooms'});
		}, 
		roomsCreate: function(req, res){
			var room = rooms.create(); 
			console.log("Create room " + room.toJSON());
			res.json(room.toJSON());
		}, 
		roomsIndexJson: function(req, res){
			res.json(rooms.toJSON());
		},
		index: function(req, res){ 
			res.render('index', { title: 'Express' })
		},
		room: function(req, res){
			var id = req.params.id;        
			var room = rooms.get(id);
			if(room == undefined){
				console.log("Open a new tractor room: " + id);
				room = rooms.create(); 
				broader.onNewRoom(id);
			}    
			res.render('tractor', {tractorGame: room, title: 'Tractor'});
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

