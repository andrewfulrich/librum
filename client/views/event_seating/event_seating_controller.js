this.EventSeatingController = RouteController.extend({
	template: "EventSeating",
	

	yieldTemplates: {
		/*YIELD_TEMPLATES*/
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("loading"); }
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("venue_sections_list", this.params.venue_id)
		];
		var ready = true;
		_.each(subs, function(sub) {
			if(!sub.ready())
				ready = false;
		});
		return ready;
	},

	data: function() {
		

		return {
			params: this.params || {},
			venue_sections_list: VenueSections.find({venue_id:this.params.venue_id}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
	}
});