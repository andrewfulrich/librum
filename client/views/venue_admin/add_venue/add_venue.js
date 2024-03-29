var pageSession = new ReactiveDict();

Template.VenueAdminAddVenue.rendered = function() {
	
};

Template.VenueAdminAddVenue.events({
	
});

Template.VenueAdminAddVenue.helpers({
	
});

Template.VenueAdminAddVenueAddVenueForm.rendered = function() {
	

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
				

				newId = Venues.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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
	}

	
});

Template.VenueAdminAddVenueAddVenueForm.helpers({
	"infoMessage": function() {
		return pageSession.get("venueAdminAddVenueAddVenueFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("venueAdminAddVenueAddVenueFormErrorMessage");
	}
	
});
