
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['error-alert.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<div class='alert alert-error'>\n  <a class='close' data-dismiss='alert' href='#'>&times;</a>\n  ";
  stack1 = depth0.system;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.error;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.message;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\n</div>\n";
  return buffer;}

  stack1 = depth0.system;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.error;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;});
Handlebars.registerPartial('error-alert.hbs', Handlebars.templates['error-alert.hbs']);
