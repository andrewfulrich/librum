Meteor.publish("orders_list", function() {
	if(Users.isInRoles(this.userId, ["user"])) {
		return Orders.publishJoinedCursors(Orders.find({}, {}));
	}
	return this.ready();
});

Meteor.publish("add_orders_query", function() {
	if(Users.isInRoles(this.userId, ["user"])) {
		return Orders.publishJoinedCursors(Orders.find({_id:null}, {}));
	}
	return this.ready();
});

