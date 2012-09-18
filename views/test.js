RoomView = Backbone.View.extend({
    initialize: function(){
        this.render();
    },
    render: function(){
        var variables = { room: this.model };
		var template = “<div class=‘room’ id=‘<%= room.id%>’><div class=‘seat west’>…</div>…</div>”;
        var template = _.template(template, variables );
        this.el.html( template );
    }
});
