Products.allow({
	insert: function (userId, doc) {
		return Products.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Products.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Products.userCanRemove(userId, doc);
	}
});

Products.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

Products.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Products.before.remove(function(userId, doc) {
	
});

Products.after.insert(function(userId, doc) {
	
});

Products.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Products.after.remove(function(userId, doc) {
	
});
