this.Events = new Mongo.Collection("events");

this.Events.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["eventAdmin"]);
}

this.Events.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["eventAdmin"]);
}

this.Events.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["eventAdmin"]);
}
