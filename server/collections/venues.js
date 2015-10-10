Venues.allow({
	insert: function (userId, doc) {
		return Venues.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Venues.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Venues.userCanRemove(userId, doc);
	}
});

Venues.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

Venues.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Venues.before.remove(function(userId, doc) {
	
});

Venues.after.insert(function(userId, doc) {
	
});

Venues.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Venues.after.remove(function(userId, doc) {
	
});
