$(function(){
	if(!("WebSocket" in window)){  
	    alert("No web socket is supported!"); 
		return;
	} 
	var roomNo = $("div.room").attr("id").substring(4); 
	var host = window.location.host;
	var socket = io.connect("ws://" + window.location.host);
  	socket.on('connected', function (data) {
		console.log("Connection is established with server");  
		socket.emit("onRoom", {roomNo: roomNo});
  	});
    socket.on("onJoin", function(data){ 
		takeSeat(data.seatId, data.player);
	});
    socket.on("onGameReady", function(data){ 
		gameReady();
	});
    socket.on("onGameStart", function(data){ 
		gameStart();
	});
    socket.on("onDeal", function(data){ 
		dealCard(data.card, data.seat);
	});
	socket.on("onDealFinish", function(data){ 
		dealCardFinish();
	});
	     
	$(".seat").each(function(index){    
		var seat = $(this);   
		var seatId = seat.attr("id").substring(4);
		seat.find(".join form").click(function(){ 
			var form = $(this);                      
			$.post($(this).attr("action"), $(this).serialize(), function(data){ 
		   		takeSeat(seatId, form.find("input[name='name']").val());  
				// disableSeats();
			}).error(function(data){
				seat.find(".message.error").removeClass("hidden");
			});	
			return false;
		});
	});
	$(".playarea .currentStatus form").click(function(){
		var form = $(this);                      
		$.post($(this).attr("action"), $(this).serialize(), function(data){ 
	   		gameStart();  
		}).error(function(data){
		    gameStartError(data);
		});	
		return false;
	});   
});      
 
function gameReady(){
	console.log("Game is ready to start.");
	$(".playarea .currentStatus form").removeClass("hidden");
} 
function gameStart(){
	console.log("Game is started.")
	$(".playarea .currentStatus form").addClass("hidden");
	$(".playarea .currentStatus .description").text("游戏已开始"); 
}
function gameStartError(data){
	console.log("Failed to start game: " + data.error); 
	var tractorGame = data.tractorGame;
	console.log("Latest game status: " + tractorGame);
} 
function dealCard(card, seat){  
	console.log("Deal card " + card + " to seat " + seat);             
	var cardDiv = "<div class='card heart'>2</div>";
	$("#seat" + seat + " .cards").append(cardDiv);
}
function dealCardFinish(){
	$(".playarea .currentStatus .description").text("发牌结束，等待亮主"); 
}
function takeSeat(seatId, player){ 
	console.log("Player " + player + " take seat " + seatId + " successfully.");
	var seat = $("#seat" + seatId);
	seat.find(".player .name").text(player); 
	seat.removeClass("notTaken");
}     
function disableSeats(){
	$(".seat").each(function(index, seat){
		$(seat).find(".join form").addClass("hidden");
		$(seat).find(".join .waiting.hidden").removeClass("hidden");
	});
}