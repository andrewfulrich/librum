this.Vendors = new Mongo.Collection("vendors");

this.Vendors.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["vendorAdmin"]);
}

this.Vendors.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["vendorAdmin"]);
}

this.Vendors.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["vendorAdmin"]);
}
