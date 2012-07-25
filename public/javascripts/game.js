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
	});
	  	 
	$(".seat").each(function(index){    
		var seat = $(this);   
		var seatId = seat.attr("id").substring(4);
		seat.find(".join form").click(function(){ 
			var form = $(this);                      
			$.post($(this).attr("action"), $(this).serialize(), function(data){ 
		   		takeSeat(seatId, form.find("input[name='name']").val());  
				disableSeats();
			}).error(function(data){
				seat.find(".message.error").removeClass("hidden");
			});	
			return false;
		});
	});   
});      

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
