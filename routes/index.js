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
			room.on('change:roomState', function(e){
				console.log("Room state changed to " + e.get('roomState'));
				broader.roomChanged(e.id, e.get('roomState'));
			});
			room.get('seats').each(function(seat){
				seat.on('change:player', function(e){
					console.log("Seat " + e.get('id') +"'s player has been changed to " + e.playerName());
					console.log(e);
					broader.seatChanged(room.id, e.get('id'), e.changed);
				});
			})
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
				throw "Room " + id + " does not exist";
			}
			if(req.session.roomId == id){
				console.log("You are already in this room with seat " + req.session.seatId);
			}    

			res.render('room', {room: room, title: 'Room ' + id});
		},
		roomJson: function(req, res){
			var room = rooms.get(req.params.id);
			res.json({room: room == undefined? {} : room.toJSON(), mySeat: req.session.seatId});
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
		
				req.session.roomId = id;
				req.session.seatId = seatId;
				req.session.name = player.get('name');
				res.send({redirect: '/room/' + room.id});
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

