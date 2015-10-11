var pageSession = new ReactiveDict();

Template.RunnerReview.rendered = function() {
	
};

Template.RunnerReview.events({
	
});

Template.RunnerReview.helpers({
	
});

var RunnerReviewRunnerReviewListItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("RunnerReviewRunnerReviewListSearchString");
	var sortBy = pageSession.get("RunnerReviewRunnerReviewListSortBy");
	var sortAscending = pageSession.get("RunnerReviewRunnerReviewListSortAscending");
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

var RunnerReviewRunnerReviewListExport = function(cursor, fileType) {
	var data = RunnerReviewRunnerReviewListItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.RunnerReviewRunnerReviewList.rendered = function() {
	pageSession.set("RunnerReviewRunnerReviewListStyle", "table");
	
};

Template.RunnerReviewRunnerReviewList.events({
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
				pageSession.set("RunnerReviewRunnerReviewListSearchString", searchString);
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
					pageSession.set("RunnerReviewRunnerReviewListSearchString", searchString);
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
					pageSession.set("RunnerReviewRunnerReviewListSearchString", "");
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
		RunnerReviewRunnerReviewListExport(this.runner_status_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		RunnerReviewRunnerReviewListExport(this.runner_status_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		RunnerReviewRunnerReviewListExport(this.runner_status_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		RunnerReviewRunnerReviewListExport(this.runner_status_list, "json");
	}

	
});

Template.RunnerReviewRunnerReviewList.helpers({

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
		return this.runner_status_list && pageSession.get("RunnerReviewRunnerReviewListSearchString") && RunnerReviewRunnerReviewListItems(this.runner_status_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("RunnerReviewRunnerReviewListSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("RunnerReviewRunnerReviewListStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("RunnerReviewRunnerReviewListStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("RunnerReviewRunnerReviewListStyle") == "gallery";
	}

	
});


Template.RunnerReviewRunnerReviewListTable.rendered = function() {
	
};
var start_time=new Date().getTime();
var seconds_elapsed=0;
var elapsed_message="";
canRate=false;

elapsed_interval = setInterval(function () {
    var hours=0, minutes=0, seconds=0;
    seconds_elapsed = ( new Date().getTime() - start_time) / 1000;
    
    //    hours = parseInt(seconds_elapsed / 3600);
    //  hours = hours == 0 ? "" : hours + " hours";
    // seconds_elapsed = seconds_elapsed % 3600;
    
    minutes = parseInt(seconds_elapsed / 60);
    minutes = minutes == 0 ? "" : minutes  + (minutes > 1 ? " minutes" : " minute");
    seconds = parseInt(seconds_elapsed % 60);
    seconds = seconds == 0 ? "" : seconds + " seconds";
    elapsed_message= minutes + " " + seconds;
    if(document.getElementById("time_elapsed")) {
        document.getElementById("time_elapsed").textContent= elapsed_message;
    }
}, 1000);
Template.RunnerReviewRunnerReviewListTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("RunnerReviewRunnerReviewListSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("RunnerReviewRunnerReviewListSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("RunnerReviewRunnerReviewListSortAscending") || false;
			pageSession.set("RunnerReviewRunnerReviewListSortAscending", !sortAscending);
		} else {
			pageSession.set("RunnerReviewRunnerReviewListSortAscending", true);
		}
	},
        "click #order_recieved_btn": function(e,t) {
                e.preventDefault();
                clearInterval(elapsed_interval);
                $("#currentStatus").text("Order Recieved after " + elapsed_message + "!");
                $("#reviewDiv").css('visibility', 'visible');
                $("#order_recieved_btn").hide();
                return false;
        },
        "click #submit_review_btn": function(e,t) {
            e.preventDefault();
            $("#reviewDiv").html("Thank you for your feedback! <a href='venue_menu' class='btn btn-primary'>Back to menu</a>");
        }
});

Template.RunnerReviewRunnerReviewListTable.helpers({
	"tableItems": function() {
		return RunnerReviewRunnerReviewListItems(this.runner_status_list);
	},
        "canRate": function() {
            return canRate;
        }
});



Template.RunnerReviewRunnerReviewListTableItems.rendered = function() {
	
};

Template.RunnerReviewRunnerReviewListTableItems.events({
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

Template.RunnerReviewRunnerReviewListTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return RunnerStatus.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return RunnerStatus.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
