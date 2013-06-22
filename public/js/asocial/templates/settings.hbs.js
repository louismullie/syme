
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['settings.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials;
  var buffer = "", stack1, foundHelper, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function", self=this;


  buffer += "<div class='row'>\n  <div class='span8 offset2'>\n    <h2>";
  foundHelper = helpers['t'];
  stack1 = foundHelper ? foundHelper.call(depth0, "settings.title", {hash:{}}) : helperMissing.call(depth0, "t", "settings.title", {hash:{}});
  buffer += escapeExpression(stack1) + "</h2>\n    <div id='error-container'></div>\n    <p>\n      <b>";
  foundHelper = helpers['t'];
  stack1 = foundHelper ? foundHelper.call(depth0, "settings.welcome", {hash:{}}) : helperMissing.call(depth0, "t", "settings.welcome", {hash:{}});
  buffer += escapeExpression(stack1) + ", ";
  stack1 = depth0.user;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.name;
  stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
  buffer += escapeExpression(stack1) + "!</b>\n      ";
  foundHelper = helpers['t'];
  stack1 = foundHelper ? foundHelper.call(depth0, "settings.explanation", {hash:{}}) : helperMissing.call(depth0, "t", "settings.explanation", {hash:{}});
  buffer += escapeExpression(stack1) + "\n    </p>\n    ";
  foundHelper = helpers['t'];
  stack1 = foundHelper ? foundHelper.call(depth0, "settings.informations", {hash:{}}) : helperMissing.call(depth0, "t", "settings.informations", {hash:{}});
  buffer += escapeExpression(stack1) + "\n    <div class='tab-content'>\n      <div class='tab-pane active' id='tab-informations'>\n        ";
  stack1 = depth0;
  stack1 = self.invokePartial(partials['settings-profile.hbs'], 'settings-profile.hbs', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </div>\n      <div class='tab-pane' id='tab-settings'>\n        ";
  stack1 = depth0;
  stack1 = self.invokePartial(partials['settings-settings.hbs'], 'settings-settings.hbs', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </div>\n    </div>\n  </div>\n</div>\n";
  return buffer;});
Handlebars.registerPartial('settings.hbs', Handlebars.templates['settings.hbs']);
