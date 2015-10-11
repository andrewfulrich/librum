// Events
Events.join(Venues, "venue", "", []);

// Vendors
Vendors.join(Venues, "venue_id", "", []);

// Products
Products.join(Vendors, "productVendor", "", []);

// Orders
Orders.join(Products, "productsOrdered", "", []);
Orders.join(Users, "runner", "", []);

// VenueSections
VenueSections.join(Venues, "venue_id", "", []);

