var pageSession = new ReactiveDict();

Template.ProductsMenu.rendered = function() {
	
};

Template.ProductsMenu.events({
	
});

Template.ProductsMenu.helpers({
	
});

var ProductsMenuMenuItemsItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("ProductsMenuMenuItemsSearchString");
	var sortBy = pageSession.get("ProductsMenuMenuItemsSortBy");
	var sortAscending = pageSession.get("ProductsMenuMenuItemsSortAscending");
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

var ProductsMenuMenuItemsExport = function(cursor, fileType) {
	var data = ProductsMenuMenuItemsItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.ProductsMenuMenuItems.rendered = function() {
	pageSession.set("ProductsMenuMenuItemsStyle", "table");
	
};

Template.ProductsMenuMenuItems.events({
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
				pageSession.set("ProductsMenuMenuItemsSearchString", searchString);
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
					pageSession.set("ProductsMenuMenuItemsSearchString", searchString);
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
					pageSession.set("ProductsMenuMenuItemsSearchString", "");
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
		ProductsMenuMenuItemsExport(this.products_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		ProductsMenuMenuItemsExport(this.products_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		ProductsMenuMenuItemsExport(this.products_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		ProductsMenuMenuItemsExport(this.products_list, "json");
	}

	
});

Template.ProductsMenuMenuItems.helpers({

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
		return this.products_list && pageSession.get("ProductsMenuMenuItemsSearchString") && ProductsMenuMenuItemsItems(this.products_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("ProductsMenuMenuItemsSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("ProductsMenuMenuItemsStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("ProductsMenuMenuItemsStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("ProductsMenuMenuItemsStyle") == "gallery";
	}

	
});


Template.ProductsMenuMenuItemsTable.rendered = function() {
	
};

Template.ProductsMenuMenuItemsTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("ProductsMenuMenuItemsSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("ProductsMenuMenuItemsSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("ProductsMenuMenuItemsSortAscending") || false;
			pageSession.set("ProductsMenuMenuItemsSortAscending", !sortAscending);
		} else {
			pageSession.set("ProductsMenuMenuItemsSortAscending", true);
		}
	}
});

Template.ProductsMenuMenuItemsTable.helpers({
	"tableItems": function() {
		return ProductsMenuMenuItemsItems(this.products_list);
	}
});


Template.ProductsMenuMenuItemsTableItems.rendered = function() {
	
};

Template.ProductsMenuMenuItemsTableItems.events({
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

Template.ProductsMenuMenuItemsTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Products.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Products.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
