this.RunnerStatusAdminController = RouteController.extend({
	template: "RunnerStatusAdmin",
	

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
			Meteor.subscribe("runner_status_list"),
			Meteor.subscribe("runner_states_list"),
			Meteor.subscribe("add_runner_status")
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
			runner_status_list: RunnerStatus.find({}, {}),
			runner_states_list: RunnerStates.find({}, {}),
			add_runner_status: RunnerStatus.findOne({_id:null}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
	}
});