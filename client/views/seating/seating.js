var pageSession = new ReactiveDict();

Template.Seating.rendered = function() {
	
};

Template.Seating.events({
	
});

Template.Seating.helpers({
	
});

Template.SeatingSeatingForm.rendered = function() {
	

	pageSession.set("seatingSeatingFormInfoMessage", "");
	pageSession.set("seatingSeatingFormErrorMessage", "");

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

Template.SeatingSeatingForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("seatingSeatingFormInfoMessage", "");
		pageSession.set("seatingSeatingFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var seatingSeatingFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(seatingSeatingFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("seatingSeatingFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("shopping_cart", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("seatingSeatingFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				
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

		Router.go("runner_selection", {});
	}

	
});

Template.SeatingSeatingForm.helpers({
	"infoMessage": function() {
		return pageSession.get("seatingSeatingFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("seatingSeatingFormErrorMessage");
	}
	
});
