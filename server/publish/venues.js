Meteor.publish("venues_list", function() {
	return Venues.find({}, {});
});

Meteor.publish("add_venue_query", function() {
	return Venues.find({_id:null}, {});
});

Meteor.publish("edit_venue_query", function(venue_id) {
	return Venues.find({_id:venue_id}, {});
});

Meteor.publish("edit_venue_query", function(venue_id) {
	return Venues.find({_id:venue_id}, {});
});

