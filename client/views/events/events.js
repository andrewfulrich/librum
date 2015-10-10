var pageSession = new ReactiveDict();

Template.Events.rendered = function() {
	
};

Template.Events.events({
	
});

Template.Events.helpers({
	
});

var EventsEventsItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("EventsEventsSearchString");
	var sortBy = pageSession.get("EventsEventsSortBy");
	var sortAscending = pageSession.get("EventsEventsSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["eventName", "venue", "eventImage"];
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

var EventsEventsExport = function(cursor, fileType) {
	var data = EventsEventsItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.EventsEvents.rendered = function() {
	pageSession.set("EventsEventsStyle", "table");
	
};

Template.EventsEvents.events({
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
				pageSession.set("EventsEventsSearchString", searchString);
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
					pageSession.set("EventsEventsSearchString", searchString);
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
					pageSession.set("EventsEventsSearchString", "");
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
		EventsEventsExport(this.events_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		EventsEventsExport(this.events_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		EventsEventsExport(this.events_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		EventsEventsExport(this.events_list, "json");
	}

	
});

Template.EventsEvents.helpers({

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
		return this.events_list && pageSession.get("EventsEventsSearchString") && EventsEventsItems(this.events_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("EventsEventsSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("EventsEventsStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("EventsEventsStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("EventsEventsStyle") == "gallery";
	}

	
});


Template.EventsEventsTable.rendered = function() {
	
};

Template.EventsEventsTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("EventsEventsSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("EventsEventsSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("EventsEventsSortAscending") || false;
			pageSession.set("EventsEventsSortAscending", !sortAscending);
		} else {
			pageSession.set("EventsEventsSortAscending", true);
		}
	}
});

Template.EventsEventsTable.helpers({
	"tableItems": function() {
		return EventsEventsItems(this.events_list);
	}
});


Template.EventsEventsTableItems.rendered = function() {
	
};

Template.EventsEventsTableItems.events({
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

Template.EventsEventsTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Events.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Events.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
