this.OrdersAdminController = RouteController.extend({
	template: "OrdersAdmin",
	

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
			Meteor.subscribe("orders_list"),
			Meteor.subscribe("runner_status_list"),
			Meteor.subscribe("add_orders_query")
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
			orders_list: Orders.find({}, {}),
			runner_status_list: RunnerStatus.find({}, {}),
			add_orders_query: Orders.findOne({_id:null}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
	}
});