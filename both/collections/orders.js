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

this.Schemas = this.Schemas || {};

this.Schemas.Orders = new SimpleSchema({
	productsOrdered: {
		label: "Your Order",
		type: [String],
		optional: true
	},
	runner: {
		label: "Runner",
		type: String,
		optional: true
	}
});

this.Orders.attachSchema(this.Schemas.Orders);
