this.VendorAdminController = RouteController.extend({
	template: "VendorAdmin",
	

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
			Meteor.subscribe("vendor_list"),
			Meteor.subscribe("venues_list"),
			Meteor.subscribe("add_vendor_query")
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
			vendor_list: Vendors.find({}, {}),
			venues_list: Venues.find({}, {}),
			add_vendor_query: Vendors.findOne({_id:null}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
	}
});