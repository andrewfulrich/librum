var pageSession = new ReactiveDict();

Template.RunnerSelection.rendered = function() {
	
};

Template.RunnerSelection.events({
	
});

Template.RunnerSelection.helpers({
	
});

var RunnerSelectionRunnerListViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("RunnerSelectionRunnerListViewSearchString");
	var sortBy = pageSession.get("RunnerSelectionRunnerListViewSortBy");
	var sortAscending = pageSession.get("RunnerSelectionRunnerListViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["user_id", "status", "user_name"];
		filtered = _.filter(raw, function(item) {
			var match = false;
			_.each(searchFields, function(field) {
				var value = (getPropertyValue(field, item) || "") + "";

				match = match || (value && value.match(regEx));
				if(match) {
					return false;
				}
			})
			return match;
		});
	}

	// sort
	if(sortBy) {
		filtered = _.sortBy(filtered, sortBy);

		// descending?
		if(!sortAscending) {
			filtered = filtered.reverse();
		}
	}

	return filtered;
};

var RunnerSelectionRunnerListViewExport = function(cursor, fileType) {
	var data = RunnerSelectionRunnerListViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.RunnerSelectionRunnerListView.rendered = function() {
	pageSession.set("RunnerSelectionRunnerListViewStyle", "table");
	
};

Template.RunnerSelectionRunnerListView.events({
	"submit #dataview-controls": function(e, t) {
		return false;
	},

	"click #dataview-search-button": function(e, t) {
		e.preventDefault();
		var form = $(e.currentTarget).parent();
		if(form) {
			var searchInput = form.find("#dataview-search-input");
			if(searchInput) {
				searchInput.focus();
				var searchString = searchInput.val();
				pageSession.set("RunnerSelectionRunnerListViewSearchString", searchString);
			}

		}
		return false;
	},

	"keydown #dataview-search-input": function(e, t) {
		if(e.which === 13)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					var searchString = searchInput.val();
					pageSession.set("RunnerSelectionRunnerListViewSearchString", searchString);
				}

			}
			return false;
		}

		if(e.which === 27)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					searchInput.val("");
					pageSession.set("RunnerSelectionRunnerListViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		/**/
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		RunnerSelectionRunnerListViewExport(this.runner_status_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		RunnerSelectionRunnerListViewExport(this.runner_status_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		RunnerSelectionRunnerListViewExport(this.runner_status_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		RunnerSelectionRunnerListViewExport(this.runner_status_list, "json");
	}

	
});

Template.RunnerSelectionRunnerListView.helpers({

	"insertButtonClass": function() {
		return RunnerStatus.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.runner_status_list || this.runner_status_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.runner_status_list && this.runner_status_list.count() > 0;
	},
	"isNotFound": function() {
		return this.runner_status_list && pageSession.get("RunnerSelectionRunnerListViewSearchString") && RunnerSelectionRunnerListViewItems(this.runner_status_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("RunnerSelectionRunnerListViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("RunnerSelectionRunnerListViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("RunnerSelectionRunnerListViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("RunnerSelectionRunnerListViewStyle") == "gallery";
	}

	
});


Template.RunnerSelectionRunnerListViewTable.rendered = function() {
	
};

Template.RunnerSelectionRunnerListViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("RunnerSelectionRunnerListViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("RunnerSelectionRunnerListViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("RunnerSelectionRunnerListViewSortAscending") || false;
			pageSession.set("RunnerSelectionRunnerListViewSortAscending", !sortAscending);
		} else {
			pageSession.set("RunnerSelectionRunnerListViewSortAscending", true);
		}
	}
});

Template.RunnerSelectionRunnerListViewTable.helpers({
	"tableItems": function() {
		return RunnerSelectionRunnerListViewItems(this.runner_status_list);
	}
});


Template.RunnerSelectionRunnerListViewTableItems.rendered = function() {
	
};

Template.RunnerSelectionRunnerListViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		/**/
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		RunnerStatus.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #delete-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Delete? Are you sure?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						RunnerStatus.remove({ _id: me._id });
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	},
	"click #edit-button": function(e, t) {
		e.preventDefault();
		/**/
		return false;
	}
});

Template.RunnerSelectionRunnerListViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return RunnerStatus.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return RunnerStatus.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
