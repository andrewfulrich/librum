RunnerStates.allow({
	insert: function (userId, doc) {
		return RunnerStates.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return RunnerStates.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return RunnerStates.userCanRemove(userId, doc);
	}
});

RunnerStates.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

RunnerStates.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

RunnerStates.before.remove(function(userId, doc) {
	
});

RunnerStates.after.insert(function(userId, doc) {
	
});

RunnerStates.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

RunnerStates.after.remove(function(userId, doc) {
	
});
