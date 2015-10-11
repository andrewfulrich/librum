this.VenueSections = new Mongo.Collection("venue_sections");

this.VenueSections.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["venueAdmin"]);
}

this.VenueSections.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["venueAdmin"]);
}

this.VenueSections.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["venueAdmin"]);
}
