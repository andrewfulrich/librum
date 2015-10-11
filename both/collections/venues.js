this.Venues = new Mongo.Collection("venues");

this.Venues.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["venueAdmin"]);
}

this.Venues.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["venueAdmin"]);
}

this.Venues.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["venueAdmin"]);
}
