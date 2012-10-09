define(['backbone', 'underscore', 'app/cards', 'app/seats'], function(Backbone, _, Cards, Seats){ 
	var RoomState = Backbone.Model.extend({
		initialize: function(name){
			this.set({name: name});
		}
	});
    
    return {WAITING: new RoomState('Waiting'), READY: new RoomState('Ready'), DEALING: new RoomState('Dealing'), FLIPPING: new RoomState('Flipping'), BURYING: new RoomState('Burying'), PLAYING: new RoomState('Playing'),DONE: new RoomState('Done'), fjod: function(json){
				switch(json.name){
					case 'Done':
						return this.DONE;
					case 'Ready':
						return this.READY;
					case 'Dealing':
						return this.DEALING;
					case 'Flipping':
						return this.FLIPPING;
					case 'Burying':
						return this.BURYING;
					case 'Playing':
						return this.PLAYING;
					case 'Waiting':
						return this.WAITING;
					default:
						throw "illegal roomState name " + json.name;
				}
    }};
});
