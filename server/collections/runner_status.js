RunnerStatus.allow({
	insert: function (userId, doc) {
		return RunnerStatus.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return RunnerStatus.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return RunnerStatus.userCanRemove(userId, doc);
	}
});

RunnerStatus.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

RunnerStatus.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

RunnerStatus.before.remove(function(userId, doc) {
	
});

RunnerStatus.after.insert(function(userId, doc) {
	
});

RunnerStatus.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

RunnerStatus.after.remove(function(userId, doc) {
	
});
