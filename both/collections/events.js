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

this.Schemas = this.Schemas || {};

this.Schemas.Events = new SimpleSchema({
	eventName: {
		label: "Event Name",
		type: String,
		optional: true
	},
	venue: {
		type: String,
		optional: true
	},
	eventImage: {
		label: "Image",
		type: String,
		optional: true
	}
});

this.Events.attachSchema(this.Schemas.Events);
