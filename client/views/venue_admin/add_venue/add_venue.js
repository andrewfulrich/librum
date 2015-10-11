var pageSession = new ReactiveDict();

Template.VenueAdminAddVenue.rendered = function() {
	
};

Template.VenueAdminAddVenue.events({
	
});

Template.VenueAdminAddVenue.helpers({
	
});

Template.VenueAdminAddVenueAddVenueForm.rendered = function() {
	pageSession.set("sectionsCrudItems", []);


	pageSession.set("venueAdminAddVenueAddVenueFormInfoMessage", "");
	pageSession.set("venueAdminAddVenueAddVenueFormErrorMessage", "");

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

Template.VenueAdminAddVenueAddVenueForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("venueAdminAddVenueAddVenueFormInfoMessage", "");
		pageSession.set("venueAdminAddVenueAddVenueFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var venueAdminAddVenueAddVenueFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(venueAdminAddVenueAddVenueFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("venueAdminAddVenueAddVenueFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("venue_admin", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("venueAdminAddVenueAddVenueFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				values.sections = pageSession.get("sectionsCrudItems"); newId = Venues.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("venue_admin", {});
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		Router.go("venue_admin", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}, 

	'click .field-sections .crud-table-row .delete-icon': function(e, t) { e.preventDefault(); var self = this; bootbox.dialog({ message: 'Delete? Are you sure?', title: 'Delete', animate: false, buttons: { success: { label: 'Yes', className: 'btn-success', callback: function() { var items = pageSession.get('sectionsCrudItems'); var index = -1; _.find(items, function(item, i) { if(item._id == self._id) { index = i; return true; }; }); if(index >= 0) items.splice(index, 1); pageSession.set('sectionsCrudItems', items); } }, danger: { label: 'No', className: 'btn-default' } } }); return false; }
});

Template.VenueAdminAddVenueAddVenueForm.helpers({
	"infoMessage": function() {
		return pageSession.get("venueAdminAddVenueAddVenueFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("venueAdminAddVenueAddVenueFormErrorMessage");
	}, 
		"sectionsCrudItems": function() {
		return pageSession.get("sectionsCrudItems");
	}
});


Template.VenueAdminAddVenueFieldSectionsInsertForm.rendered = function() {
	pageSession.set("seatsCrudItems", []);


	pageSession.set("venueAdminAddVenueFieldSectionsInsertFormInfoMessage", "");
	pageSession.set("venueAdminAddVenueFieldSectionsInsertFormErrorMessage", "");

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

Template.VenueAdminAddVenueFieldSectionsInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("venueAdminAddVenueFieldSectionsInsertFormInfoMessage", "");
		pageSession.set("venueAdminAddVenueFieldSectionsInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var venueAdminAddVenueFieldSectionsInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(venueAdminAddVenueFieldSectionsInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("venueAdminAddVenueFieldSectionsInsertFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("venueAdminAddVenueFieldSectionsInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				var data = pageSession.get("sectionsCrudItems") || []; values._id = Random.id(); data.push(values); pageSession.set("sectionsCrudItems", data); $("#field-sections-insert-form").modal("hide"); e.currentTarget.reset();
values.seats = pageSession.get("seatsCrudItems");
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		$("#field-sections-insert-form").modal("hide"); t.find("form").reset();

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

Template.VenueAdminAddVenueFieldSectionsInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("venueAdminAddVenueFieldSectionsInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("venueAdminAddVenueFieldSectionsInsertFormErrorMessage");
	}, 
		"seatsCrudItems": function() {
		return pageSession.get("seatsCrudItems");
	}
});


Template.VenueAdminAddVenueFieldSeatsInsertForm.rendered = function() {
	

	pageSession.set("venueAdminAddVenueFieldSeatsInsertFormInfoMessage", "");
	pageSession.set("venueAdminAddVenueFieldSeatsInsertFormErrorMessage", "");

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

Template.VenueAdminAddVenueFieldSeatsInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("venueAdminAddVenueFieldSeatsInsertFormInfoMessage", "");
		pageSession.set("venueAdminAddVenueFieldSeatsInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var venueAdminAddVenueFieldSeatsInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(venueAdminAddVenueFieldSeatsInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("venueAdminAddVenueFieldSeatsInsertFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("venueAdminAddVenueFieldSeatsInsertFormErrorMessage", message);
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

Template.VenueAdminAddVenueFieldSeatsInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("venueAdminAddVenueFieldSeatsInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("venueAdminAddVenueFieldSeatsInsertFormErrorMessage");
	}
	
});
