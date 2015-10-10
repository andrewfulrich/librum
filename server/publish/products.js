Meteor.publish("products_list", function() {
	return Products.publishJoinedCursors(Products.find({}, {}));
});

