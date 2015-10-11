var pageSession = new ReactiveDict();

Template.SectionSeatingAdmin.rendered = function() {
	
};

Template.SectionSeatingAdmin.events({
	
});

Template.SectionSeatingAdmin.helpers({
	
});

var SectionSeatingAdminSectionSeatingListAllItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("SectionSeatingAdminSectionSeatingListAllSearchString");
	var sortBy = pageSession.get("SectionSeatingAdminSectionSeatingListAllSortBy");
	var sortAscending = pageSession.get("SectionSeatingAdminSectionSeatingListAllSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["seats", "sectionName", "venue_id", "venue_name"];
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

var SectionSeatingAdminSectionSeatingListAllExport = function(cursor, fileType) {
	var data = SectionSeatingAdminSectionSeatingListAllItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.SectionSeatingAdminSectionSeatingListAll.rendered = function() {
	pageSession.set("SectionSeatingAdminSectionSeatingListAllStyle", "table");
	
};

Template.SectionSeatingAdminSectionSeatingListAll.events({
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
				pageSession.set("SectionSeatingAdminSectionSeatingListAllSearchString", searchString);
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
					pageSession.set("SectionSeatingAdminSectionSeatingListAllSearchString", searchString);
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
					pageSession.set("SectionSeatingAdminSectionSeatingListAllSearchString", "");
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
		SectionSeatingAdminSectionSeatingListAllExport(this.venue_sections_list_all, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		SectionSeatingAdminSectionSeatingListAllExport(this.venue_sections_list_all, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		SectionSeatingAdminSectionSeatingListAllExport(this.venue_sections_list_all, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		SectionSeatingAdminSectionSeatingListAllExport(this.venue_sections_list_all, "json");
	}

	
});

Template.SectionSeatingAdminSectionSeatingListAll.helpers({

	"insertButtonClass": function() {
		return VenueSections.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.venue_sections_list_all || this.venue_sections_list_all.count() == 0;
	},
	"isNotEmpty": function() {
		return this.venue_sections_list_all && this.venue_sections_list_all.count() > 0;
	},
	"isNotFound": function() {
		return this.venue_sections_list_all && pageSession.get("SectionSeatingAdminSectionSeatingListAllSearchString") && SectionSeatingAdminSectionSeatingListAllItems(this.venue_sections_list_all).length == 0;
	},
	"searchString": function() {
		return pageSession.get("SectionSeatingAdminSectionSeatingListAllSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("SectionSeatingAdminSectionSeatingListAllStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("SectionSeatingAdminSectionSeatingListAllStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("SectionSeatingAdminSectionSeatingListAllStyle") == "gallery";
	}

	
});


Template.SectionSeatingAdminSectionSeatingListAllTable.rendered = function() {
	
};

Template.SectionSeatingAdminSectionSeatingListAllTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("SectionSeatingAdminSectionSeatingListAllSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("SectionSeatingAdminSectionSeatingListAllSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("SectionSeatingAdminSectionSeatingListAllSortAscending") || false;
			pageSession.set("SectionSeatingAdminSectionSeatingListAllSortAscending", !sortAscending);
		} else {
			pageSession.set("SectionSeatingAdminSectionSeatingListAllSortAscending", true);
		}
	}
});

Template.SectionSeatingAdminSectionSeatingListAllTable.helpers({
	"tableItems": function() {
		return SectionSeatingAdminSectionSeatingListAllItems(this.venue_sections_list_all);
	}
});


Template.SectionSeatingAdminSectionSeatingListAllTableItems.rendered = function() {
	
};

Template.SectionSeatingAdminSectionSeatingListAllTableItems.events({
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

		VenueSections.update({ _id: this._id }, { $set: values });

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
						VenueSections.remove({ _id: me._id });
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

Template.SectionSeatingAdminSectionSeatingListAllTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return VenueSections.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return VenueSections.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});

Template.SectionSeatingAdminAddSectionSeatingForm.rendered = function() {
	pageSession.set("seatsCrudItems", []);


	pageSession.set("sectionSeatingAdminAddSectionSeatingFormInfoMessage", "");
	pageSession.set("sectionSeatingAdminAddSectionSeatingFormErrorMessage", "");

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

Template.SectionSeatingAdminAddSectionSeatingForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("sectionSeatingAdminAddSectionSeatingFormInfoMessage", "");
		pageSession.set("sectionSeatingAdminAddSectionSeatingFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var sectionSeatingAdminAddSectionSeatingFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(sectionSeatingAdminAddSectionSeatingFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("sectionSeatingAdminAddSectionSeatingFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("sectionSeatingAdminAddSectionSeatingFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				values.seats = pageSession.get("seatsCrudItems"); newId = VenueSections.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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
	}, 

	'click .field-seats .crud-table-row .delete-icon': function(e, t) { e.preventDefault(); var self = this; bootbox.dialog({ message: 'Delete? Are you sure?', title: 'Delete', animate: false, buttons: { success: { label: 'Yes', className: 'btn-success', callback: function() { var items = pageSession.get('seatsCrudItems'); var index = -1; _.find(items, function(item, i) { if(item._id == self._id) { index = i; return true; }; }); if(index >= 0) items.splice(index, 1); pageSession.set('seatsCrudItems', items); } }, danger: { label: 'No', className: 'btn-default' } } }); return false; }
});

Template.SectionSeatingAdminAddSectionSeatingForm.helpers({
	"infoMessage": function() {
		return pageSession.get("sectionSeatingAdminAddSectionSeatingFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("sectionSeatingAdminAddSectionSeatingFormErrorMessage");
	}, 
		"seatsCrudItems": function() {
		return pageSession.get("seatsCrudItems");
	}
});


Template.SectionSeatingAdminFieldSeatsInsertForm.rendered = function() {
	

	pageSession.set("sectionSeatingAdminFieldSeatsInsertFormInfoMessage", "");
	pageSession.set("sectionSeatingAdminFieldSeatsInsertFormErrorMessage", "");

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

Template.SectionSeatingAdminFieldSeatsInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("sectionSeatingAdminFieldSeatsInsertFormInfoMessage", "");
		pageSession.set("sectionSeatingAdminFieldSeatsInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var sectionSeatingAdminFieldSeatsInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(sectionSeatingAdminFieldSeatsInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("sectionSeatingAdminFieldSeatsInsertFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("sectionSeatingAdminFieldSeatsInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				var data = pageSession.get("seatsCrudItems") || []; values._id = Random.id(); data.push(values); pageSession.set("seatsCrudItems", data); $("#field-seats-insert-form").modal("hide"); e.currentTarget.reset();
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		$("#field-seats-insert-form").modal("hide"); t.find("form").reset();

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

Template.SectionSeatingAdminFieldSeatsInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("sectionSeatingAdminFieldSeatsInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("sectionSeatingAdminFieldSeatsInsertFormErrorMessage");
	}
	
});
