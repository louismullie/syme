
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['modals-alert.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "\n  <a class='hint--left' data-hint='Close' href='#' role='close-modal'>\n    <i class='icon-remove-sign'></i>\n  </a>\n  ";}

  buffer += "<div class='modal-title'>\n  ";
  foundHelper = helpers.title;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\n  ";
  stack1 = depth0.closable;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n<div class='modal-content'>\n  ";
  foundHelper = helpers.content;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.content; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\n  <a class='modal-button' href='#' role='close-modal'>\n    ";
  foundHelper = helpers.submit;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.submit; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\n  </a>\n</div>\n";
  return buffer;});
Handlebars.registerPartial('modals-alert.hbs', Handlebars.templates['modals-alert.hbs']);
