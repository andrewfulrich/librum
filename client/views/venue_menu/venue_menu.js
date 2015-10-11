var pageSession = new ReactiveDict();

Template.VenueMenu.rendered = function() {
	
};

Template.VenueMenu.events({
	
});

Template.VenueMenu.helpers({
	
});

var VenueMenuMenuItemsItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("VenueMenuMenuItemsSearchString");
	var sortBy = pageSession.get("VenueMenuMenuItemsSortBy");
	var sortAscending = pageSession.get("VenueMenuMenuItemsSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["productName", "productVendor", "productPrice", "productImage", "vendor_name"];
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

var VenueMenuMenuItemsExport = function(cursor, fileType) {
	var data = VenueMenuMenuItemsItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.VenueMenuMenuItems.rendered = function() {
	pageSession.set("VenueMenuMenuItemsStyle", "table");
	
};

Template.VenueMenuMenuItems.events({
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
				pageSession.set("VenueMenuMenuItemsSearchString", searchString);
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
					pageSession.set("VenueMenuMenuItemsSearchString", searchString);
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
					pageSession.set("VenueMenuMenuItemsSearchString", "");
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
		VenueMenuMenuItemsExport(this.products_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		VenueMenuMenuItemsExport(this.products_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		VenueMenuMenuItemsExport(this.products_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		VenueMenuMenuItemsExport(this.products_list, "json");
	}

	
});

Template.VenueMenuMenuItems.helpers({

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
		return this.products_list && pageSession.get("VenueMenuMenuItemsSearchString") && VenueMenuMenuItemsItems(this.products_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("VenueMenuMenuItemsSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("VenueMenuMenuItemsStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("VenueMenuMenuItemsStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("VenueMenuMenuItemsStyle") == "gallery";
	}

	
});


Template.VenueMenuMenuItemsTable.rendered = function() {
	
};

Template.VenueMenuMenuItemsTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("VenueMenuMenuItemsSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("VenueMenuMenuItemsSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("VenueMenuMenuItemsSortAscending") || false;
			pageSession.set("VenueMenuMenuItemsSortAscending", !sortAscending);
		} else {
			pageSession.set("VenueMenuMenuItemsSortAscending", true);
		}
	}
});

Template.VenueMenuMenuItemsTable.helpers({
	"tableItems": function() {
		return VenueMenuMenuItemsItems(this.products_list);
	}
});


Template.VenueMenuMenuItemsTableItems.rendered = function() {
	
};

Template.VenueMenuMenuItemsTableItems.events({
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

Template.VenueMenuMenuItemsTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Products.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Products.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
