$(function(){
	$.get("/data/rooms", function(data){  
		console.log("There are " + data.length +" available now.");		
   		roomsView.addAll(data);
	});
});	
