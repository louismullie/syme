
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['empty.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class='notification' id='empty'>\n  <p class='empty-notification'>\n    No new notifications.\n  </p>\n</div>\n";});
Handlebars.registerPartial('empty.hbs', Handlebars.templates['empty.hbs']);
