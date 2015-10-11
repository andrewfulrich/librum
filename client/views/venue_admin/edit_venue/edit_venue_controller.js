this.VenueAdminEditVenueController = RouteController.extend({
	template: "VenueAdminEditVenue",
	

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
			Meteor.subscribe("edit_venue_query", this.params.venue_id)
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
			edit_venue_query: Venues.findOne({_id:this.params.venue_id}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
	}
});