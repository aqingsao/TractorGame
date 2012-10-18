define(['util', 'app/cards', 'app/rooms', 'app/room', 'app/player', 'broader'], function(util, Cards, Rooms, Room, Player, broader){
	var rooms = new Rooms();   

	var jacky = new Player({name: 'Jacky'});
	var nana = new Player({name: 'Nana'});
	var kerry = new Player({name: 'Kerry'});
	var yao = new Player({name: 'Yao'});
 
 	var createRoom = function(id){
 		var room = new Room({id: id, dealInterval: 100}); 
		room.id = id;
		room.on('change', function(e){
			console.log("Room changed...");
			console.log(e.changed);
			broader.roomChanged(e.id, e.changed);
		});

		room.get('seats').each(function(seat){
			seat.on('change', function(e){
				console.log("Seat " + e.get('id') +" of room " + room.id +" changed...");
				broader.seatChanged(room.id, e.get('id'), e.changed);
			});
			seat.get("cards").bind("add", function(e){
				broader.dealCard(room.id, seat.get('id'), e.toJSON());
			});
			seat.get("cards").bind("remove", function(e){
				broader.buryCard(room.id, seat.get('id'), e.toJSON());
			});
		}); 
		return room;
 	}; 
 	var readyGame = function(id){
		var room = createRoom(id);
		room.join(jacky, 0);
		room.join(nana, 1);
		room.join(kerry, 2);
		return room;
	}
	rooms.add(readyGame(9998));
	rooms.add(readyGame(9999));
	rooms.add(readyGame(9997));

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
			var room = createRoom(id);
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
			console.log(room);
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
		roomStart: function(req, res){
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
				console.log("Failed to start in room " + id + ": " + error);
				res.json({error: error, room: room.toJSON()}, 400);
			}
		},
		roomFlip: function(req, res){
			var id = req.params.id; 
			var seatId = req.params.seatId;
			var cardIds = req.body.cards;
			var room = rooms.get(id);
			try{
				if(room == undefined){
					throw "Invalid room id " + id;
				}
				var seat = room.getSeat(seatId);
				if(seat == undefined){
					console.log(room.get('seats').map(function(seat){return seat.get('id')}));
					throw "Invalid seat id " + seatId + " for room " + id;
				}
				console.log("Seat " + seatId + " is fliping in room " + id +" with cards " + cardIds);

				room.flip(seat, seat.getCards(cardIds));
				res.json({});
			}catch(error){  
				console.log("Failed to flip in room " + id + ": " + error);
				res.json({error: error, room: room.toJSON()}, 400);
			}
		},
		roomBury: function(req, res){
			var id = req.params.id; 
			var seatId = req.params.seatId;
			var cardIds = req.body.cards;
			var room = rooms.get(id);
			try{
				if(room == undefined){
					throw "Invalid room id " + id;
				}
				var seat = room.getSeat(seatId);
				if(seat == undefined){
					console.log(room.get('seats').map(function(seat){return seat.get('id')}));
					throw "Invalid seat id " + seatId + " for room " + id;
				}
				console.log("Seat " + seatId + " is burying in room " + id +" with cards " + cardIds);

				room.bury(seat, seat.getCards(cardIds));
				res.json({});
			}catch(error){  
				console.log("Failed to bury in room " + id + ": " + error);
				res.json({error: error, room: room.toJSON()}, 400);
			}
		}, 
		roomPlay: function(req, res){
			var id = req.params.id; 
			var seatId = req.params.seatId;
			var cardIds = req.body.cards;
			var room = rooms.get(id);
			try{
				if(room == undefined){
					throw "Invalid room id " + id;
				}
				var seat = room.getSeat(seatId);
				if(seat == undefined){
					console.log(room.get('seats').map(function(seat){return seat.get('id')}));
					throw "Invalid seat id " + seatId + " for room " + id;
				}
				console.log("Seat " + seatId + " is playing in room " + id +" with cards " + cardIds);

				room.playCards(seat, seat.getCards(cardIds));
				res.json({});
			}catch(error){  
				console.log("Failed to play in room " + id + ": " + error);
				res.json({error: error, room: room.toJSON()}, 400);
			}
		}

	}	
		
});
	
/*
 * GET home page.
 */

