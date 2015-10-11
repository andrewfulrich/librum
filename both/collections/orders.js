this.Orders = new Mongo.Collection("orders");

this.Orders.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["user"]);
}

this.Orders.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["user"]);
}

this.Orders.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["user"]);
}
