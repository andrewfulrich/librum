var pageSession = new ReactiveDict();

Template.OrdersAdmin.rendered = function() {
	
};

Template.OrdersAdmin.events({
	
});

Template.OrdersAdmin.helpers({
	
});

var OrdersAdminOrdersListViewbItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("OrdersAdminOrdersListViewbSearchString");
	var sortBy = pageSession.get("OrdersAdminOrdersListViewbSortBy");
	var sortAscending = pageSession.get("OrdersAdminOrdersListViewbSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["productsOrdered", "runner", "buyer", "runner_name", "buyer_name"];
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

var OrdersAdminOrdersListViewbExport = function(cursor, fileType) {
	var data = OrdersAdminOrdersListViewbItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.OrdersAdminOrdersListViewb.rendered = function() {
	pageSession.set("OrdersAdminOrdersListViewbStyle", "table");
	
};

Template.OrdersAdminOrdersListViewb.events({
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
				pageSession.set("OrdersAdminOrdersListViewbSearchString", searchString);
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
					pageSession.set("OrdersAdminOrdersListViewbSearchString", searchString);
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
					pageSession.set("OrdersAdminOrdersListViewbSearchString", "");
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
		OrdersAdminOrdersListViewbExport(this.orders_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		OrdersAdminOrdersListViewbExport(this.orders_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		OrdersAdminOrdersListViewbExport(this.orders_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		OrdersAdminOrdersListViewbExport(this.orders_list, "json");
	}

	
});

Template.OrdersAdminOrdersListViewb.helpers({

	"insertButtonClass": function() {
		return Orders.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.orders_list || this.orders_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.orders_list && this.orders_list.count() > 0;
	},
	"isNotFound": function() {
		return this.orders_list && pageSession.get("OrdersAdminOrdersListViewbSearchString") && OrdersAdminOrdersListViewbItems(this.orders_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("OrdersAdminOrdersListViewbSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("OrdersAdminOrdersListViewbStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("OrdersAdminOrdersListViewbStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("OrdersAdminOrdersListViewbStyle") == "gallery";
	}

	
});


Template.OrdersAdminOrdersListViewbTable.rendered = function() {
	
};

Template.OrdersAdminOrdersListViewbTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("OrdersAdminOrdersListViewbSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("OrdersAdminOrdersListViewbSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("OrdersAdminOrdersListViewbSortAscending") || false;
			pageSession.set("OrdersAdminOrdersListViewbSortAscending", !sortAscending);
		} else {
			pageSession.set("OrdersAdminOrdersListViewbSortAscending", true);
		}
	}
});

Template.OrdersAdminOrdersListViewbTable.helpers({
	"tableItems": function() {
		return OrdersAdminOrdersListViewbItems(this.orders_list);
	}
});


Template.OrdersAdminOrdersListViewbTableItems.rendered = function() {
	
};

Template.OrdersAdminOrdersListViewbTableItems.events({
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

		Orders.update({ _id: this._id }, { $set: values });

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
						Orders.remove({ _id: me._id });
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

Template.OrdersAdminOrdersListViewbTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Orders.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Orders.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});

Template.OrdersAdminAddOrdersForm.rendered = function() {
	

	pageSession.set("ordersAdminAddOrdersFormInfoMessage", "");
	pageSession.set("ordersAdminAddOrdersFormErrorMessage", "");

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

Template.OrdersAdminAddOrdersForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("ordersAdminAddOrdersFormInfoMessage", "");
		pageSession.set("ordersAdminAddOrdersFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var ordersAdminAddOrdersFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(ordersAdminAddOrdersFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("ordersAdminAddOrdersFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("orders_admin", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("ordersAdminAddOrdersFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = Orders.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.OrdersAdminAddOrdersForm.helpers({
	"infoMessage": function() {
		return pageSession.get("ordersAdminAddOrdersFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("ordersAdminAddOrdersFormErrorMessage");
	}
	
});
