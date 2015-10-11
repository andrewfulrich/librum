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

this.Schemas = this.Schemas || {};

this.Schemas.Venues = new SimpleSchema({
	venueName: {
		label: "Venue Name",
		type: String,
		optional: true
	},
	sections: {
		label: "Sections",
		type: [Object],
		blackbox: true,
		optional: true
	}
});

this.Venues.attachSchema(this.Schemas.Venues);
