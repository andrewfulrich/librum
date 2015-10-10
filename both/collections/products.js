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

this.Schemas = this.Schemas || {};

this.Schemas.Products = new SimpleSchema({
	productName: {
		label: "Product Name",
		type: String,
		optional: true
	},
	productVendor: {
		label: "Vendor",
		type: String,
		optional: true
	},
	productPrice: {
		label: "Price",
		type: Number,
		decimal: true,
		optional: true
	},
	productImage: {
		label: "Image",
		type: String,
		optional: true
	}
});

this.Products.attachSchema(this.Schemas.Products);
