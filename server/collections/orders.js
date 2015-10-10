Orders.allow({
	insert: function (userId, doc) {
		return Orders.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Orders.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Orders.userCanRemove(userId, doc);
	}
});

Orders.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

Orders.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Orders.before.remove(function(userId, doc) {
	
});

Orders.after.insert(function(userId, doc) {
	
});

Orders.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Orders.after.remove(function(userId, doc) {
	
});
