var pageSession = new ReactiveDict();

Template.VendorAdmin.rendered = function() {
	
};

Template.VendorAdmin.events({
	
});

Template.VendorAdmin.helpers({
	
});

var VendorAdminVendorListViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("VendorAdminVendorListViewSearchString");
	var sortBy = pageSession.get("VendorAdminVendorListViewSortBy");
	var sortAscending = pageSession.get("VendorAdminVendorListViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["vendorName", "vendorImage", "venue_id", "venue_name"];
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

var VendorAdminVendorListViewExport = function(cursor, fileType) {
	var data = VendorAdminVendorListViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.VendorAdminVendorListView.rendered = function() {
	pageSession.set("VendorAdminVendorListViewStyle", "table");
	
};

Template.VendorAdminVendorListView.events({
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
				pageSession.set("VendorAdminVendorListViewSearchString", searchString);
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
					pageSession.set("VendorAdminVendorListViewSearchString", searchString);
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
					pageSession.set("VendorAdminVendorListViewSearchString", "");
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
		VendorAdminVendorListViewExport(this.vendor_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		VendorAdminVendorListViewExport(this.vendor_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		VendorAdminVendorListViewExport(this.vendor_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		VendorAdminVendorListViewExport(this.vendor_list, "json");
	}

	
});

Template.VendorAdminVendorListView.helpers({

	"insertButtonClass": function() {
		return Vendors.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.vendor_list || this.vendor_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.vendor_list && this.vendor_list.count() > 0;
	},
	"isNotFound": function() {
		return this.vendor_list && pageSession.get("VendorAdminVendorListViewSearchString") && VendorAdminVendorListViewItems(this.vendor_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("VendorAdminVendorListViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("VendorAdminVendorListViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("VendorAdminVendorListViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("VendorAdminVendorListViewStyle") == "gallery";
	}

	
});


Template.VendorAdminVendorListViewTable.rendered = function() {
	
};

Template.VendorAdminVendorListViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("VendorAdminVendorListViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("VendorAdminVendorListViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("VendorAdminVendorListViewSortAscending") || false;
			pageSession.set("VendorAdminVendorListViewSortAscending", !sortAscending);
		} else {
			pageSession.set("VendorAdminVendorListViewSortAscending", true);
		}
	}
});

Template.VendorAdminVendorListViewTable.helpers({
	"tableItems": function() {
		return VendorAdminVendorListViewItems(this.vendor_list);
	}
});


Template.VendorAdminVendorListViewTableItems.rendered = function() {
	
};

Template.VendorAdminVendorListViewTableItems.events({
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

		Vendors.update({ _id: this._id }, { $set: values });

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
						Vendors.remove({ _id: me._id });
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

Template.VendorAdminVendorListViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Vendors.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Vendors.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});

Template.VendorAdminAddVendorForm.rendered = function() {
	

	pageSession.set("vendorAdminAddVendorFormInfoMessage", "");
	pageSession.set("vendorAdminAddVendorFormErrorMessage", "");

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

Template.VendorAdminAddVendorForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("vendorAdminAddVendorFormInfoMessage", "");
		pageSession.set("vendorAdminAddVendorFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var vendorAdminAddVendorFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(vendorAdminAddVendorFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("vendorAdminAddVendorFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("vendor_admin", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("vendorAdminAddVendorFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = Vendors.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.VendorAdminAddVendorForm.helpers({
	"infoMessage": function() {
		return pageSession.get("vendorAdminAddVendorFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("vendorAdminAddVendorFormErrorMessage");
	}
	
});
