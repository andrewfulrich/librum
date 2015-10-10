// Events
Events.join(Venues, "venue", "", []);

// Products
Products.join(Vendors, "productVendor", "", []);

// Orders
Orders.join(Products, "productsOrdered", "", []);
Orders.join(Users, "runner", "", []);

