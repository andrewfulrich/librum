var pageSession = new ReactiveDict();

Template.ProductAdmin.rendered = function() {
	
};

Template.ProductAdmin.events({
	
});

Template.ProductAdmin.helpers({
	
});

var ProductAdminProductListViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("ProductAdminProductListViewSearchString");
	var sortBy = pageSession.get("ProductAdminProductListViewSortBy");
	var sortAscending = pageSession.get("ProductAdminProductListViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["productName", "productVendor", "productPrice", "productImage"];
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

var ProductAdminProductListViewExport = function(cursor, fileType) {
	var data = ProductAdminProductListViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.ProductAdminProductListView.rendered = function() {
	pageSession.set("ProductAdminProductListViewStyle", "table");
	
};

Template.ProductAdminProductListView.events({
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
				pageSession.set("ProductAdminProductListViewSearchString", searchString);
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
					pageSession.set("ProductAdminProductListViewSearchString", searchString);
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
					pageSession.set("ProductAdminProductListViewSearchString", "");
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
		ProductAdminProductListViewExport(this.products_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		ProductAdminProductListViewExport(this.products_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		ProductAdminProductListViewExport(this.products_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		ProductAdminProductListViewExport(this.products_list, "json");
	}

	
});

Template.ProductAdminProductListView.helpers({

	"insertButtonClass": function() {
		return Products.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.products_list || this.products_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.products_list && this.products_list.count() > 0;
	},
	"isNotFound": function() {
		return this.products_list && pageSession.get("ProductAdminProductListViewSearchString") && ProductAdminProductListViewItems(this.products_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("ProductAdminProductListViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("ProductAdminProductListViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("ProductAdminProductListViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("ProductAdminProductListViewStyle") == "gallery";
	}

	
});


Template.ProductAdminProductListViewTable.rendered = function() {
	
};

Template.ProductAdminProductListViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("ProductAdminProductListViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("ProductAdminProductListViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("ProductAdminProductListViewSortAscending") || false;
			pageSession.set("ProductAdminProductListViewSortAscending", !sortAscending);
		} else {
			pageSession.set("ProductAdminProductListViewSortAscending", true);
		}
	}
});

Template.ProductAdminProductListViewTable.helpers({
	"tableItems": function() {
		return ProductAdminProductListViewItems(this.products_list);
	}
});


Template.ProductAdminProductListViewTableItems.rendered = function() {
	
};

Template.ProductAdminProductListViewTableItems.events({
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

		Products.update({ _id: this._id }, { $set: values });

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
						Products.remove({ _id: me._id });
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

Template.ProductAdminProductListViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Products.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Products.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});

Template.ProductAdminAddProductForm.rendered = function() {
	

	pageSession.set("productAdminAddProductFormInfoMessage", "");
	pageSession.set("productAdminAddProductFormErrorMessage", "");

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

Template.ProductAdminAddProductForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("productAdminAddProductFormInfoMessage", "");
		pageSession.set("productAdminAddProductFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var productAdminAddProductFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(productAdminAddProductFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("productAdminAddProductFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("product_admin", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("productAdminAddProductFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = Products.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.ProductAdminAddProductForm.helpers({
	"infoMessage": function() {
		return pageSession.get("productAdminAddProductFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("productAdminAddProductFormErrorMessage");
	}
	
});
