//= require ./vendor/includer.js
//= require ./app/includer.js
//= require_tree ./views

// Register all Handlebars templates.
try {
  
  Handlebars.templates = {};

  $.each(HandlebarsTemplates, function (name, template) {
    var name = name.split('/').slice(1).join('-');
    Handlebars.templates[name] = template;
    Handlebars.registerPartial(name, template);
  });
} catch (e) {
  console.error('Handlebars registration failed', e);
}