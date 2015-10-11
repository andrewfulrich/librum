this.RunnerStatus = new Mongo.Collection("runner_status");

this.RunnerStatus.userCanInsert = function(userId, doc) {
	return true;
}

this.RunnerStatus.userCanUpdate = function(userId, doc) {
	return true;
}

this.RunnerStatus.userCanRemove = function(userId, doc) {
	return true;
}
