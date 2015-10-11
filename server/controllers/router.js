Router.map(function () {
this.route('home', {
  path: '/',
  layoutTemplate: 'complexLayout',
  action: function() {
    eventObject = this.params.event;
    customer = Mongo.users.findOne({emails.address});
    customer.profile.mastercadId= eventObject.data.Id 
}
);
Router.route('/webhooks/customerCreate',{where:'server'}).post(function(){

    })
);
