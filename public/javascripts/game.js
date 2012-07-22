$(function(){ 
	$(".seat").each(function(index){    
		var seat = $(this);
		seat.find(".join form").click(function(){     
			$.post($(this).attr("action"), $(this).serialize(), function(data){ 
				seat.find(".join").addClass("hidden");
				setupSeat(seat, data);
				seat.removeClass("notTaken");
			}).error(function(data){
				seat.find(".message.error").removeClass("hidden");
			});	
			return false;
		});
	});   
});      

function setupSeat(seat, player){
	seat.find(".player .name").text(player.name);
}