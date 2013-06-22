
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['time.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<time class='timeago' datetime='";
  foundHelper = helpers.created_at;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.created_at; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "'></time>\n";
  return buffer;});
Handlebars.registerPartial('time.hbs', Handlebars.templates['time.hbs']);
