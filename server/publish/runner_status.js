Meteor.publish("add_runner_status", function() {
	return RunnerStatus.publishJoinedCursors(RunnerStatus.find({_id:null}, {}));
});

Meteor.publish("runner_status_list", function() {
	return RunnerStatus.publishJoinedCursors(RunnerStatus.find({}, {}));
});

