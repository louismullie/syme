
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['profile.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function";


  buffer += "<form class='form-horizontal' id='settings' method='post'>\n  <div class='pull-left'>\n    <div class='control-group'>\n      <label class='control-label' for='first_name'>";
  foundHelper = helpers['t'];
  stack1 = foundHelper ? foundHelper.call(depth0, "settings.first_name", {hash:{}}) : helperMissing.call(depth0, "t", "settings.first_name", {hash:{}});
  buffer += escapeExpression(stack1) + ":</label>\n      <div class='controls'>\n        <input data-validation-maxlength-message='This name is a bit too long. Do you have a shorter one?' data-validation-regex-message=\"This doesn't look like a name\" data-validation-regex-regex='[A-ZÉ][a-zéèê]+([- ][A-ZÉ][a-zéèê]*)?' maxlength='30' name='first_name' placeholder='";
  stack1 = depth0.user;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.first_name;
  stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
  buffer += escapeExpression(stack1) + "' type='text'>\n      </div>\n    </div>\n    <div class='control-group'>\n      <label class='control-label' for='last_name'>";
  foundHelper = helpers['t'];
  stack1 = foundHelper ? foundHelper.call(depth0, "settings.last_name", {hash:{}}) : helperMissing.call(depth0, "t", "settings.last_name", {hash:{}});
  buffer += escapeExpression(stack1) + ":</label>\n      <div class='controls'>\n        <input data-validation-maxlength-message='This name is a bit too long. Do you have a shorter one?' data-validation-regex-message=\"This doesn't look like a name\" data-validation-regex-regex='[A-ZÉ][a-zéèê]+([- ][A-ZÉ][a-zéèê]*)?' maxlength='30' name='last_name' placeholder='";
  stack1 = depth0.user;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.last_name;
  stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
  buffer += escapeExpression(stack1) + "' type='text'>\n      </div>\n    </div>\n  </div>\n  <div class='pull-right clearfix'>\n    <input class='btn btn-info' type='submit' value='";
  foundHelper = helpers['t'];
  stack1 = foundHelper ? foundHelper.call(depth0, "settings.update_button", {hash:{}}) : helperMissing.call(depth0, "t", "settings.update_button", {hash:{}});
  buffer += escapeExpression(stack1) + "'>\n  </div>\n</form>\n";
  return buffer;});
