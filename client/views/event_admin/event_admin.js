var pageSession = new ReactiveDict();

Template.EventAdmin.rendered = function() {
	
};

Template.EventAdmin.events({
	
});

Template.EventAdmin.helpers({
	
});

var EventAdminEventAdminListItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("EventAdminEventAdminListSearchString");
	var sortBy = pageSession.get("EventAdminEventAdminListSortBy");
	var sortAscending = pageSession.get("EventAdminEventAdminListSortAscending");
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

var EventAdminEventAdminListExport = function(cursor, fileType) {
	var data = EventAdminEventAdminListItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.EventAdminEventAdminList.rendered = function() {
	pageSession.set("EventAdminEventAdminListStyle", "table");
	
};

Template.EventAdminEventAdminList.events({
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
				pageSession.set("EventAdminEventAdminListSearchString", searchString);
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
					pageSession.set("EventAdminEventAdminListSearchString", searchString);
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
					pageSession.set("EventAdminEventAdminListSearchString", "");
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
		EventAdminEventAdminListExport(this.events_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		EventAdminEventAdminListExport(this.events_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		EventAdminEventAdminListExport(this.events_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		EventAdminEventAdminListExport(this.events_list, "json");
	}

	
});

Template.EventAdminEventAdminList.helpers({

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
		return this.events_list && pageSession.get("EventAdminEventAdminListSearchString") && EventAdminEventAdminListItems(this.events_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("EventAdminEventAdminListSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("EventAdminEventAdminListStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("EventAdminEventAdminListStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("EventAdminEventAdminListStyle") == "gallery";
	}

	
});


Template.EventAdminEventAdminListTable.rendered = function() {
	
};

Template.EventAdminEventAdminListTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("EventAdminEventAdminListSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("EventAdminEventAdminListSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("EventAdminEventAdminListSortAscending") || false;
			pageSession.set("EventAdminEventAdminListSortAscending", !sortAscending);
		} else {
			pageSession.set("EventAdminEventAdminListSortAscending", true);
		}
	}
});

Template.EventAdminEventAdminListTable.helpers({
	"tableItems": function() {
		return EventAdminEventAdminListItems(this.events_list);
	}
});


Template.EventAdminEventAdminListTableItems.rendered = function() {
	
};

Template.EventAdminEventAdminListTableItems.events({
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

Template.EventAdminEventAdminListTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Events.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Events.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});

Template.EventAdminAddEvent.rendered = function() {
	

	pageSession.set("eventAdminAddEventInfoMessage", "");
	pageSession.set("eventAdminAddEventErrorMessage", "");

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();
		}
		else {
			format = "mm/dd/yyyy";
		}

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format
		});
	});

	$("input[type='file']").fileinput();
	$("select[data-role='tagsinput']").tagsinput();
	$(".bootstrap-tagsinput").addClass("form-control");
	$("input[autofocus]").focus();
};

Template.EventAdminAddEvent.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("eventAdminAddEventInfoMessage", "");
		pageSession.set("eventAdminAddEventErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var eventAdminAddEventMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(eventAdminAddEventMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("eventAdminAddEventInfoMessage", message);
					}; break;
				}
			}

			Router.go("event_admin", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("eventAdminAddEventErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = Events.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("event_admin", {});
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}

	
});

Template.EventAdminAddEvent.helpers({
	"infoMessage": function() {
		return pageSession.get("eventAdminAddEventInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("eventAdminAddEventErrorMessage");
	}
	
});
