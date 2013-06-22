
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['settings-settings.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  foundHelper = helpers['t'];
  stack1 = foundHelper ? foundHelper.call(depth0, "settings.settings", {hash:{}}) : helperMissing.call(depth0, "t", "settings.settings", {hash:{}});
  buffer += escapeExpression(stack1) + "\n";
  foundHelper = helpers['t'];
  stack1 = foundHelper ? foundHelper.call(depth0, "settings.delete_account", {hash:{}}) : helperMissing.call(depth0, "t", "settings.delete_account", {hash:{}});
  buffer += escapeExpression(stack1) + "\n";
  return buffer;});
Handlebars.registerPartial('settings-settings.hbs', Handlebars.templates['settings-settings.hbs']);
