Meteor.publish("runner_states_list", function() {
	return RunnerStates.find({}, {});
});

Meteor.publish("add_runner_states", function() {
	return RunnerStates.find({_id:null}, {});
});

