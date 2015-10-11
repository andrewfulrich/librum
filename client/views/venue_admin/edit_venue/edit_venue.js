var pageSession = new ReactiveDict();

Template.VenueAdminEditVenue.rendered = function() {
	
};

Template.VenueAdminEditVenue.events({
	
});

Template.VenueAdminEditVenue.helpers({
	
});

Template.VenueAdminEditVenueEditVenueForm.rendered = function() {
	

	pageSession.set("venueAdminEditVenueEditVenueFormInfoMessage", "");
	pageSession.set("venueAdminEditVenueEditVenueFormErrorMessage", "");

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

Template.VenueAdminEditVenueEditVenueForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("venueAdminEditVenueEditVenueFormInfoMessage", "");
		pageSession.set("venueAdminEditVenueEditVenueFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var venueAdminEditVenueEditVenueFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(venueAdminEditVenueEditVenueFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("venueAdminEditVenueEditVenueFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("venue_admin", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("venueAdminEditVenueEditVenueFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Venues.update({ _id: t.data.edit_venue_query._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.VenueAdminEditVenueEditVenueForm.helpers({
	"infoMessage": function() {
		return pageSession.get("venueAdminEditVenueEditVenueFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("venueAdminEditVenueEditVenueFormErrorMessage");
	}
	
});
