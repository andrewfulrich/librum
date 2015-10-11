this.SectionSeatingAdminController = RouteController.extend({
	template: "SectionSeatingAdmin",
	

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
			Meteor.subscribe("venue_sections_list_all"),
			Meteor.subscribe("venues_list"),
			Meteor.subscribe("add_section_seating_query")
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
			venue_sections_list_all: VenueSections.find({}, {}),
			venues_list: Venues.find({}, {}),
			add_section_seating_query: VenueSections.findOne({_id:null}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
	}
});