var pageSession = new ReactiveDict();

Template.OrderConfirmation.rendered = function() {
	
};

Template.OrderConfirmation.events({
	
});

Template.OrderConfirmation.helpers({
	
});

var OrderConfirmationOrderConfirmationListViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("OrderConfirmationOrderConfirmationListViewSearchString");
	var sortBy = pageSession.get("OrderConfirmationOrderConfirmationListViewSortBy");
	var sortAscending = pageSession.get("OrderConfirmationOrderConfirmationListViewSortAscending");
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

var OrderConfirmationOrderConfirmationListViewExport = function(cursor, fileType) {
	var data = OrderConfirmationOrderConfirmationListViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.OrderConfirmationOrderConfirmationListView.rendered = function() {
	pageSession.set("OrderConfirmationOrderConfirmationListViewStyle", "table");
	
};

Template.OrderConfirmationOrderConfirmationListView.events({
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
				pageSession.set("OrderConfirmationOrderConfirmationListViewSearchString", searchString);
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
					pageSession.set("OrderConfirmationOrderConfirmationListViewSearchString", searchString);
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
					pageSession.set("OrderConfirmationOrderConfirmationListViewSearchString", "");
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
		OrderConfirmationOrderConfirmationListViewExport(this.orders_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		OrderConfirmationOrderConfirmationListViewExport(this.orders_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		OrderConfirmationOrderConfirmationListViewExport(this.orders_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		OrderConfirmationOrderConfirmationListViewExport(this.orders_list, "json");
	}

	
});

Template.OrderConfirmationOrderConfirmationListView.helpers({

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
		return this.orders_list && pageSession.get("OrderConfirmationOrderConfirmationListViewSearchString") && OrderConfirmationOrderConfirmationListViewItems(this.orders_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("OrderConfirmationOrderConfirmationListViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("OrderConfirmationOrderConfirmationListViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("OrderConfirmationOrderConfirmationListViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("OrderConfirmationOrderConfirmationListViewStyle") == "gallery";
	}

	
});


Template.OrderConfirmationOrderConfirmationListViewTable.rendered = function() {
	
};

Template.OrderConfirmationOrderConfirmationListViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("OrderConfirmationOrderConfirmationListViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("OrderConfirmationOrderConfirmationListViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("OrderConfirmationOrderConfirmationListViewSortAscending") || false;
			pageSession.set("OrderConfirmationOrderConfirmationListViewSortAscending", !sortAscending);
		} else {
			pageSession.set("OrderConfirmationOrderConfirmationListViewSortAscending", true);
		}
	}
});

Template.OrderConfirmationOrderConfirmationListViewTable.helpers({
	"tableItems": function() {
		return OrderConfirmationOrderConfirmationListViewItems(this.orders_list);
	}
});


Template.OrderConfirmationOrderConfirmationListViewTableItems.rendered = function() {
	
};

Template.OrderConfirmationOrderConfirmationListViewTableItems.events({
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

Template.OrderConfirmationOrderConfirmationListViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Orders.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Orders.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
