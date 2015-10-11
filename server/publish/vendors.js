Meteor.publish("vendor_list", function() {
	return Vendors.publishJoinedCursors(Vendors.find({}, {}));
});

Meteor.publish("add_vendor_query", function() {
	return Vendors.publishJoinedCursors(Vendors.find({_id:null}, {}));
});

