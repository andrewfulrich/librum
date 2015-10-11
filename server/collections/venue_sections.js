VenueSections.allow({
	insert: function (userId, doc) {
		return VenueSections.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return VenueSections.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return VenueSections.userCanRemove(userId, doc);
	}
});

VenueSections.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

VenueSections.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

VenueSections.before.remove(function(userId, doc) {
	
});

VenueSections.after.insert(function(userId, doc) {
	
});

VenueSections.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

VenueSections.after.remove(function(userId, doc) {
	
});
