var pageSession = new ReactiveDict();

Template.RunnerStateAdmin.rendered = function() {
	
};

Template.RunnerStateAdmin.events({
	
});

Template.RunnerStateAdmin.helpers({
	
});

var RunnerStateAdminRunnerStateListViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("RunnerStateAdminRunnerStateListViewSearchString");
	var sortBy = pageSession.get("RunnerStateAdminRunnerStateListViewSortBy");
	var sortAscending = pageSession.get("RunnerStateAdminRunnerStateListViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name"];
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

var RunnerStateAdminRunnerStateListViewExport = function(cursor, fileType) {
	var data = RunnerStateAdminRunnerStateListViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.RunnerStateAdminRunnerStateListView.rendered = function() {
	pageSession.set("RunnerStateAdminRunnerStateListViewStyle", "table");
	
};

Template.RunnerStateAdminRunnerStateListView.events({
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
				pageSession.set("RunnerStateAdminRunnerStateListViewSearchString", searchString);
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
					pageSession.set("RunnerStateAdminRunnerStateListViewSearchString", searchString);
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
					pageSession.set("RunnerStateAdminRunnerStateListViewSearchString", "");
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
		RunnerStateAdminRunnerStateListViewExport(this.runner_states_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		RunnerStateAdminRunnerStateListViewExport(this.runner_states_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		RunnerStateAdminRunnerStateListViewExport(this.runner_states_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		RunnerStateAdminRunnerStateListViewExport(this.runner_states_list, "json");
	}

	
});

Template.RunnerStateAdminRunnerStateListView.helpers({

	"insertButtonClass": function() {
		return RunnerStates.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.runner_states_list || this.runner_states_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.runner_states_list && this.runner_states_list.count() > 0;
	},
	"isNotFound": function() {
		return this.runner_states_list && pageSession.get("RunnerStateAdminRunnerStateListViewSearchString") && RunnerStateAdminRunnerStateListViewItems(this.runner_states_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("RunnerStateAdminRunnerStateListViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("RunnerStateAdminRunnerStateListViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("RunnerStateAdminRunnerStateListViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("RunnerStateAdminRunnerStateListViewStyle") == "gallery";
	}

	
});


Template.RunnerStateAdminRunnerStateListViewTable.rendered = function() {
	
};

Template.RunnerStateAdminRunnerStateListViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("RunnerStateAdminRunnerStateListViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("RunnerStateAdminRunnerStateListViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("RunnerStateAdminRunnerStateListViewSortAscending") || false;
			pageSession.set("RunnerStateAdminRunnerStateListViewSortAscending", !sortAscending);
		} else {
			pageSession.set("RunnerStateAdminRunnerStateListViewSortAscending", true);
		}
	}
});

Template.RunnerStateAdminRunnerStateListViewTable.helpers({
	"tableItems": function() {
		return RunnerStateAdminRunnerStateListViewItems(this.runner_states_list);
	}
});


Template.RunnerStateAdminRunnerStateListViewTableItems.rendered = function() {
	
};

Template.RunnerStateAdminRunnerStateListViewTableItems.events({
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

		RunnerStates.update({ _id: this._id }, { $set: values });

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
						RunnerStates.remove({ _id: me._id });
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

Template.RunnerStateAdminRunnerStateListViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return RunnerStates.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return RunnerStates.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});

Template.RunnerStateAdminAddRunnerStateForm.rendered = function() {
	

	pageSession.set("runnerStateAdminAddRunnerStateFormInfoMessage", "");
	pageSession.set("runnerStateAdminAddRunnerStateFormErrorMessage", "");

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

Template.RunnerStateAdminAddRunnerStateForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("runnerStateAdminAddRunnerStateFormInfoMessage", "");
		pageSession.set("runnerStateAdminAddRunnerStateFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var runnerStateAdminAddRunnerStateFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(runnerStateAdminAddRunnerStateFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("runnerStateAdminAddRunnerStateFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("runner_state_admin", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("runnerStateAdminAddRunnerStateFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = RunnerStates.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.RunnerStateAdminAddRunnerStateForm.helpers({
	"infoMessage": function() {
		return pageSession.get("runnerStateAdminAddRunnerStateFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("runnerStateAdminAddRunnerStateFormErrorMessage");
	}
	
});
