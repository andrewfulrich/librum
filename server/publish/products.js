Meteor.publish("products_list", function() {
	return Products.publishJoinedCursors(Products.find({}, {}));
});

Meteor.publish("add_product_query", function() {
	return Products.publishJoinedCursors(Products.find({_id:null}, {}));
});

