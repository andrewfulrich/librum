Meteor.publish("events_list", function() {
	return Events.publishJoinedCursors(Events.find({}, {}));
});

Meteor.publish("add_event_query", function() {
	return Events.publishJoinedCursors(Events.find({_id:null}, {}));
});

