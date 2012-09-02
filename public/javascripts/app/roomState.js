define(['backbone', 'underscore', 'app/cards', 'app/seats', 'app/round'], function(Backbone, _, Cards, Seats, Round){ 
	var RoomState = Backbone.Model.extend({
		initialize: function(name){
			this.set({name: name});
		}
	});
    
    return {WAITING: new RoomState('Waiting'), PLAYING: new RoomState('Playing'),DONE: new RoomState('Done')};
});
