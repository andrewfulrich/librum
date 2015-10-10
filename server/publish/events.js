Meteor.publish("events_list", function() {
	return Events.publishJoinedCursors(Events.find({}, {}));
});

