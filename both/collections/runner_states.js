this.RunnerStates = new Mongo.Collection("runner_states");

this.RunnerStates.userCanInsert = function(userId, doc) {
	return true;
}

this.RunnerStates.userCanUpdate = function(userId, doc) {
	return true;
}

this.RunnerStates.userCanRemove = function(userId, doc) {
	return true;
}
