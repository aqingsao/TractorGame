require.config({
	baseUrl: "/javascripts", 
	paths: {
		jquery: '/javascripts/lib/jquery-1.7.2.min'
	}, 
	shim: {
		'underscore': {
			exports: '_'
		}, 
		'backbone': {
			exports: 'Backbone'
		},
		'util': {
			exports: 'util'
		},
		'common': {
			exports: 'Common'
		}
	}
}); 

require(['jquery', 'underscore', 'backbone', 'app/rooms'], function($, _, Backbone, Rooms){
		$.get("/data/rooms", function(data){
			$(".count").text(data.length);
			if(data.length > 0){
				
			} 
			else{
				
			}
		});
		$(".newRoom").click(function(){
			var form = $(this);                      
			$.post($(this).attr("action"), function(data){
				 alert("create room successfully with room id ");
			}).error(function(data){
				$(".message.error").removeClass("hidden");
			});	
			return false;
		});
});    