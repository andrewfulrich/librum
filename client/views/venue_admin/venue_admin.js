var pageSession = new ReactiveDict();

Template.VenueAdmin.rendered = function() {
	
};

Template.VenueAdmin.events({
	
});

Template.VenueAdmin.helpers({
	
});

var VenueAdminVenueAdminViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("VenueAdminVenueAdminViewSearchString");
	var sortBy = pageSession.get("VenueAdminVenueAdminViewSortBy");
	var sortAscending = pageSession.get("VenueAdminVenueAdminViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["venueName", "sections"];
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

var VenueAdminVenueAdminViewExport = function(cursor, fileType) {
	var data = VenueAdminVenueAdminViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.VenueAdminVenueAdminView.rendered = function() {
	pageSession.set("VenueAdminVenueAdminViewStyle", "table");
	
};

Template.VenueAdminVenueAdminView.events({
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
				pageSession.set("VenueAdminVenueAdminViewSearchString", searchString);
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
					pageSession.set("VenueAdminVenueAdminViewSearchString", searchString);
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
					pageSession.set("VenueAdminVenueAdminViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("venue_admin.add_venue", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		VenueAdminVenueAdminViewExport(this.venues_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		VenueAdminVenueAdminViewExport(this.venues_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		VenueAdminVenueAdminViewExport(this.venues_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		VenueAdminVenueAdminViewExport(this.venues_list, "json");
	}

	
});

Template.VenueAdminVenueAdminView.helpers({

	"insertButtonClass": function() {
		return Venues.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.venues_list || this.venues_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.venues_list && this.venues_list.count() > 0;
	},
	"isNotFound": function() {
		return this.venues_list && pageSession.get("VenueAdminVenueAdminViewSearchString") && VenueAdminVenueAdminViewItems(this.venues_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("VenueAdminVenueAdminViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("VenueAdminVenueAdminViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("VenueAdminVenueAdminViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("VenueAdminVenueAdminViewStyle") == "gallery";
	}

	
});


Template.VenueAdminVenueAdminViewTable.rendered = function() {
	
};

Template.VenueAdminVenueAdminViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("VenueAdminVenueAdminViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("VenueAdminVenueAdminViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("VenueAdminVenueAdminViewSortAscending") || false;
			pageSession.set("VenueAdminVenueAdminViewSortAscending", !sortAscending);
		} else {
			pageSession.set("VenueAdminVenueAdminViewSortAscending", true);
		}
	}
});

Template.VenueAdminVenueAdminViewTable.helpers({
	"tableItems": function() {
		return VenueAdminVenueAdminViewItems(this.venues_list);
	}
});


Template.VenueAdminVenueAdminViewTableItems.rendered = function() {
	
};

Template.VenueAdminVenueAdminViewTableItems.events({
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

		Venues.update({ _id: this._id }, { $set: values });

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
						Venues.remove({ _id: me._id });
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

Template.VenueAdminVenueAdminViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Venues.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Venues.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
