Router.configure({
	templateNameConverter: "upperCamelCase",
	routeControllerNameConverter: "upperCamelCase",
	layoutTemplate: "layout",
	notFoundTemplate: "notFound",
	loadingTemplate: "loading"
});

var publicRoutes = [
	"home_public",
	"login",
	"register",
	"forgot_password",
	"reset_password"
];

var privateRoutes = [
	"home_private",
	"user_settings",
	"user_settings.profile",
	"user_settings.change_pass",
	"user_settings.payment_methods",
	"logout",
	"events",
	"venue_menu",
	"event_seating",
	"venue_admin",
	"venue_admin.add_venue",
	"venue_admin.edit_venue",
	"event_admin",
	"section_seating_admin",
	"vendor_admin",
	"product_admin",
	"runner_status_admin",
	"runner_state_admin",
	"runner_selection",
	"orders_admin",
	"shopping_cart",
	"check_out",
	"order_confirmation",
	"runner_review",
	"seating"
];

var freeRoutes = [
	
];

var roleMap = [
	
];

this.firstGrantedRoute = function(preferredRoute) {
	if(preferredRoute && routeGranted(preferredRoute)) return preferredRoute;

	var grantedRoute = "";

	_.every(privateRoutes, function(route) {
		if(routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});
	if(grantedRoute) return grantedRoute;

	_.every(publicRoutes, function(route) {
		if(routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});
	if(grantedRoute) return grantedRoute;

	_.every(freeRoutes, function(route) {
		if(routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});
	if(grantedRoute) return grantedRoute;

	if(!grantedRoute) {
		// what to do?
		console.log("All routes are restricted for current user.");
	}

	return "";
}

// this function returns true if user is in role allowed to access given route
this.routeGranted = function(routeName) {
	if(!routeName) {
		// route without name - enable access (?)
		return true;
	}

	if(!roleMap || roleMap.length === 0) {
		// this app don't have role map - enable access
		return true;
	}

	var roleMapItem = _.find(roleMap, function(roleItem) { return roleItem.route == routeName; });
	if(!roleMapItem) {
		// page is not restricted
		return true;
	}

	if(!Meteor.user() || !Meteor.user().roles) {
		// user is not logged in
		return false;
	}

	// this page is restricted to some role(s), check if user is in one of allowedRoles
	var allowedRoles = roleMapItem.roles;
	var granted = _.intersection(allowedRoles, Meteor.user().roles);
	if(!granted || granted.length === 0) {
		return false;
	}

	return true;
};

Router.ensureLogged = function() {
	if(Meteor.userId() && (!Meteor.user() || !Meteor.user().roles)) {
		return;
	}

	if(!Meteor.userId()) {
		// user is not logged in - redirect to public home
		var redirectRoute = firstGrantedRoute("home_public");
		this.redirect(redirectRoute);
	} else {
		// user is logged in - check role
		if(!routeGranted(this.route.getName())) {
			// user is not in allowedRoles - redirect to first granted route
			var redirectRoute = firstGrantedRoute("home_private");
			this.redirect(redirectRoute);
		} else {
			this.next();
		}
	}
};

Router.ensureNotLogged = function() {
	if(Meteor.userId() && (!Meteor.user() || !Meteor.user().roles)) {
		return;
	}

	if(Meteor.userId()) {
		var redirectRoute = firstGrantedRoute("home_private");
		this.redirect(redirectRoute);
	}
	else {
		this.next();
	}
};

// called for pages in free zone - some of pages can be restricted
Router.ensureGranted = function() {
	if(Meteor.userId() && (!Meteor.user() || !Meteor.user().roles)) {
		return;
	}

	if(!routeGranted(this.route.getName())) {
		// user is not in allowedRoles - redirect to first granted route
		var redirectRoute = firstGrantedRoute("");
		this.redirect(redirectRoute);
	} else {
		this.next();
	}
};

Router.waitOn(function() { 
	Meteor.subscribe("current_user_data");
});

Router.onBeforeAction(function() {
	// loading indicator here
	if(!this.ready()) {
		$("body").addClass("wait");
	} else {
		$("body").removeClass("wait");
		this.next();
	}
});

Router.onBeforeAction(Router.ensureNotLogged, {only: publicRoutes});
Router.onBeforeAction(Router.ensureLogged, {only: privateRoutes});
Router.onBeforeAction(Router.ensureGranted, {only: freeRoutes}); // yes, route from free zone can be restricted to specific set of user roles

Router.map(function () {
	
	this.route("home_public", {path: "/", controller: "HomePublicController"});
	this.route("login", {path: "/login", controller: "LoginController"});
	this.route("register", {path: "/register", controller: "RegisterController"});
	this.route("forgot_password", {path: "/forgot_password", controller: "ForgotPasswordController"});
	this.route("reset_password", {path: "/reset_password/:resetPasswordToken", controller: "ResetPasswordController"});
	this.route("home_private", {path: "/home_private", controller: "HomePrivateController"});
	this.route("user_settings", {path: "/user_settings", controller: "UserSettingsController"});
	this.route("user_settings.profile", {path: "/user_settings/profile", controller: "UserSettingsProfileController"});
	this.route("user_settings.change_pass", {path: "/user_settings/change_pass", controller: "UserSettingsChangePassController"});
	this.route("user_settings.payment_methods", {path: "/user_settings/payment_methods", controller: "UserSettingsPaymentMethodsController"});
	this.route("logout", {path: "/logout", controller: "LogoutController"});
	this.route("events", {path: "/events", controller: "EventsController"});
	this.route("venue_menu", {path: "/venue_menu", controller: "VenueMenuController"});
	this.route("event_seating", {path: "/event_seating", controller: "EventSeatingController"});
	this.route("venue_admin", {path: "/venue_admin", controller: "VenueAdminController"});
	this.route("venue_admin.add_venue", {path: "/venue_admin/add_venue", controller: "VenueAdminAddVenueController"});
	this.route("venue_admin.edit_venue", {path: "/venue_admin/edit_venue/:venue_id", controller: "VenueAdminEditVenueController"});
	this.route("event_admin", {path: "/event_admin", controller: "EventAdminController"});
	this.route("section_seating_admin", {path: "/section_seating_admin", controller: "SectionSeatingAdminController"});
	this.route("vendor_admin", {path: "/vendor_admin", controller: "VendorAdminController"});
	this.route("product_admin", {path: "/product_admin", controller: "ProductAdminController"});
	this.route("runner_status_admin", {path: "/runner_status_admin", controller: "RunnerStatusAdminController"});
	this.route("runner_state_admin", {path: "/runner_state_admin", controller: "RunnerStateAdminController"});
	this.route("runner_selection", {path: "/runner_selection", controller: "RunnerSelectionController"});
	this.route("orders_admin", {path: "/orders_admin", controller: "OrdersAdminController"});
	this.route("shopping_cart", {path: "/shopping_cart", controller: "ShoppingCartController"});
	this.route("check_out", {path: "/check_out", controller: "CheckOutController"});
	this.route("order_confirmation", {path: "/order_confirmation", controller: "OrderConfirmationController"});
	this.route("runner_review", {path: "/runner_review", controller: "RunnerReviewController"});
	this.route("seating", {path: "/seating", controller: "SeatingController"});
});
