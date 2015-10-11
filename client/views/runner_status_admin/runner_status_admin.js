var pageSession = new ReactiveDict();

Template.RunnerStatusAdmin.rendered = function() {
	
};

Template.RunnerStatusAdmin.events({
	
});

Template.RunnerStatusAdmin.helpers({
	
});

var RunnerStatusAdminRunnerStatusListViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("RunnerStatusAdminRunnerStatusListViewSearchString");
	var sortBy = pageSession.get("RunnerStatusAdminRunnerStatusListViewSortBy");
	var sortAscending = pageSession.get("RunnerStatusAdminRunnerStatusListViewSortAscending");
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

var RunnerStatusAdminRunnerStatusListViewExport = function(cursor, fileType) {
	var data = RunnerStatusAdminRunnerStatusListViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.RunnerStatusAdminRunnerStatusListView.rendered = function() {
	pageSession.set("RunnerStatusAdminRunnerStatusListViewStyle", "table");
	
};

Template.RunnerStatusAdminRunnerStatusListView.events({
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
				pageSession.set("RunnerStatusAdminRunnerStatusListViewSearchString", searchString);
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
					pageSession.set("RunnerStatusAdminRunnerStatusListViewSearchString", searchString);
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
					pageSession.set("RunnerStatusAdminRunnerStatusListViewSearchString", "");
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
		RunnerStatusAdminRunnerStatusListViewExport(this.runner_status_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		RunnerStatusAdminRunnerStatusListViewExport(this.runner_status_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		RunnerStatusAdminRunnerStatusListViewExport(this.runner_status_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		RunnerStatusAdminRunnerStatusListViewExport(this.runner_status_list, "json");
	}

	
});

Template.RunnerStatusAdminRunnerStatusListView.helpers({

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
		return this.runner_status_list && pageSession.get("RunnerStatusAdminRunnerStatusListViewSearchString") && RunnerStatusAdminRunnerStatusListViewItems(this.runner_status_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("RunnerStatusAdminRunnerStatusListViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("RunnerStatusAdminRunnerStatusListViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("RunnerStatusAdminRunnerStatusListViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("RunnerStatusAdminRunnerStatusListViewStyle") == "gallery";
	}

	
});


Template.RunnerStatusAdminRunnerStatusListViewTable.rendered = function() {
	
};

Template.RunnerStatusAdminRunnerStatusListViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("RunnerStatusAdminRunnerStatusListViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("RunnerStatusAdminRunnerStatusListViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("RunnerStatusAdminRunnerStatusListViewSortAscending") || false;
			pageSession.set("RunnerStatusAdminRunnerStatusListViewSortAscending", !sortAscending);
		} else {
			pageSession.set("RunnerStatusAdminRunnerStatusListViewSortAscending", true);
		}
	}
});

Template.RunnerStatusAdminRunnerStatusListViewTable.helpers({
	"tableItems": function() {
		return RunnerStatusAdminRunnerStatusListViewItems(this.runner_status_list);
	}
});


Template.RunnerStatusAdminRunnerStatusListViewTableItems.rendered = function() {
	
};

Template.RunnerStatusAdminRunnerStatusListViewTableItems.events({
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

Template.RunnerStatusAdminRunnerStatusListViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return RunnerStatus.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return RunnerStatus.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});

Template.RunnerStatusAdminAddRunnerStatusForm.rendered = function() {
	

	pageSession.set("runnerStatusAdminAddRunnerStatusFormInfoMessage", "");
	pageSession.set("runnerStatusAdminAddRunnerStatusFormErrorMessage", "");

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

Template.RunnerStatusAdminAddRunnerStatusForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("runnerStatusAdminAddRunnerStatusFormInfoMessage", "");
		pageSession.set("runnerStatusAdminAddRunnerStatusFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var runnerStatusAdminAddRunnerStatusFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(runnerStatusAdminAddRunnerStatusFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("runnerStatusAdminAddRunnerStatusFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("runner_status_admin", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("runnerStatusAdminAddRunnerStatusFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = RunnerStatus.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		/*CANCEL_REDIRECT*/
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

Template.RunnerStatusAdminAddRunnerStatusForm.helpers({
	"infoMessage": function() {
		return pageSession.get("runnerStatusAdminAddRunnerStatusFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("runnerStatusAdminAddRunnerStatusFormErrorMessage");
	}
	
});
