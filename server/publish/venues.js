Meteor.publish("venues_list", function() {
	return Venues.find({}, {});
});

Meteor.publish("add_venue_query", function() {
	return Venues.find({_id:null}, {});
});

