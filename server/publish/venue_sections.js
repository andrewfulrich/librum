Meteor.publish("venue_sections_list", function(venue_id) {
	return VenueSections.publishJoinedCursors(VenueSections.find({venue_id:venue_id}, {}));
});

Meteor.publish("venue_sections_list_all", function() {
	return VenueSections.publishJoinedCursors(VenueSections.find({}, {}));
});

Meteor.publish("add_section_seating_query", function() {
	return VenueSections.publishJoinedCursors(VenueSections.find({_id:null}, {}));
});

