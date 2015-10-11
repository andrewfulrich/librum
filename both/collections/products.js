this.Products = new Mongo.Collection("products");

this.Products.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["vendorAdmin"]);
}

this.Products.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["vendorAdmin"]);
}

this.Products.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["vendorAdmin"]);
}
