var pageSession = new ReactiveDict();

Template.HomePrivate.rendered = function() {
	
};

Template.HomePrivate.events({
	
});

Template.HomePrivate.helpers({
	
});

var HomePrivateOtherEventListViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("HomePrivateOtherEventListViewSearchString");
	var sortBy = pageSession.get("HomePrivateOtherEventListViewSortBy");
	var sortAscending = pageSession.get("HomePrivateOtherEventListViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["eventName", "venue", "eventImage", "venueName"];
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

var HomePrivateOtherEventListViewExport = function(cursor, fileType) {
	var data = HomePrivateOtherEventListViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.HomePrivateOtherEventListView.rendered = function() {
	pageSession.set("HomePrivateOtherEventListViewStyle", "table");
	
};

Template.HomePrivateOtherEventListView.events({
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
				pageSession.set("HomePrivateOtherEventListViewSearchString", searchString);
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
					pageSession.set("HomePrivateOtherEventListViewSearchString", searchString);
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
					pageSession.set("HomePrivateOtherEventListViewSearchString", "");
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
		HomePrivateOtherEventListViewExport(this.events_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		HomePrivateOtherEventListViewExport(this.events_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		HomePrivateOtherEventListViewExport(this.events_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		HomePrivateOtherEventListViewExport(this.events_list, "json");
	}

	
});

Template.HomePrivateOtherEventListView.helpers({

	"insertButtonClass": function() {
		return Events.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.events_list || this.events_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.events_list && this.events_list.count() > 0;
	},
	"isNotFound": function() {
		return this.events_list && pageSession.get("HomePrivateOtherEventListViewSearchString") && HomePrivateOtherEventListViewItems(this.events_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("HomePrivateOtherEventListViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("HomePrivateOtherEventListViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("HomePrivateOtherEventListViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("HomePrivateOtherEventListViewStyle") == "gallery";
	}

	
});


Template.HomePrivateOtherEventListViewTable.rendered = function() {
	
};

Template.HomePrivateOtherEventListViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("HomePrivateOtherEventListViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("HomePrivateOtherEventListViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("HomePrivateOtherEventListViewSortAscending") || false;
			pageSession.set("HomePrivateOtherEventListViewSortAscending", !sortAscending);
		} else {
			pageSession.set("HomePrivateOtherEventListViewSortAscending", true);
		}
	}
});

Template.HomePrivateOtherEventListViewTable.helpers({
	"tableItems": function() {
		return HomePrivateOtherEventListViewItems(this.events_list);
	}
});


Template.HomePrivateOtherEventListViewTableItems.rendered = function() {
	
};

Template.HomePrivateOtherEventListViewTableItems.events({
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

		Events.update({ _id: this._id }, { $set: values });

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
						Events.remove({ _id: me._id });
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

Template.HomePrivateOtherEventListViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Events.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Events.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
