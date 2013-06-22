
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['forbidden.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "<div class='container'>\n  <div class='row'>\n    <div class='span8 offset2'>\n      <h1 class='enormous'>\n        ";
  foundHelper = helpers['t'];
  stack1 = foundHelper ? foundHelper.call(depth0, "forbidden.title", {hash:{}}) : helperMissing.call(depth0, "t", "forbidden.title", {hash:{}});
  buffer += escapeExpression(stack1) + "\n      </h1>\n      <p class='lead'>\n        ";
  foundHelper = helpers['t'];
  stack1 = foundHelper ? foundHelper.call(depth0, "forbidden.text", {hash:{}}) : helperMissing.call(depth0, "t", "forbidden.text", {hash:{}});
  buffer += escapeExpression(stack1) + "\n      </p>\n      <p class='text-align-right'>\n        <a class='btn btn-large' href='/'>\n          ";
  foundHelper = helpers['t'];
  stack1 = foundHelper ? foundHelper.call(depth0, "forbidden.button", {hash:{}}) : helperMissing.call(depth0, "t", "forbidden.button", {hash:{}});
  buffer += escapeExpression(stack1) + "\n        </a>\n      </p>\n    </div>\n  </div>\n</div>\n";
  return buffer;});
Handlebars.registerPartial('forbidden.hbs', Handlebars.templates['forbidden.hbs']);
