
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['error-notfound.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "<div class='row'>\n  <div class='columns small-24 large-12 large-centered'>\n    <h1 class='enormous'>\n      ";
  foundHelper = helpers['t'];
  stack1 = foundHelper ? foundHelper.call(depth0, "not_found.title", {hash:{}}) : helperMissing.call(depth0, "t", "not_found.title", {hash:{}});
  buffer += escapeExpression(stack1) + "\n    </h1>\n    <p class='lead'>\n      ";
  foundHelper = helpers['t'];
  stack1 = foundHelper ? foundHelper.call(depth0, "not_found.text", {hash:{}}) : helperMissing.call(depth0, "t", "not_found.text", {hash:{}});
  buffer += escapeExpression(stack1) + "\n    </p>\n    <p class='text-align-right'>\n      <a class='btn btn-large' href='/'>\n        &lt; ";
  foundHelper = helpers['t'];
  stack1 = foundHelper ? foundHelper.call(depth0, "not_found.button", {hash:{}}) : helperMissing.call(depth0, "t", "not_found.button", {hash:{}});
  buffer += escapeExpression(stack1) + "\n      </a>\n    </p>\n  </div>\n</div>\n";
  return buffer;});
Handlebars.registerPartial('error-notfound.hbs', Handlebars.templates['error-notfound.hbs']);
