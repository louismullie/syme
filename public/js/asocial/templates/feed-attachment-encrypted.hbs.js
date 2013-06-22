
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['feed-attachment-encrypted.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  foundHelper = helpers.image_size;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.image_size; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + " - ";
  return buffer;}

  buffer += "<a class='encrypted-file' data-attachment-filename='";
  foundHelper = helpers.filename;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.filename; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "' data-attachment-id='";
  foundHelper = helpers.id;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "' data-attachment-key='";
  foundHelper = helpers.key;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.key; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "' data-attachment-size='";
  foundHelper = helpers.size;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.size; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "' href='#'>";
  stack1 = depth0.attachment;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.filename;
  stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
  buffer += escapeExpression(stack1) + "\n(";
  stack1 = depth0.is_image;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  stack1 = depth0.size;
  foundHelper = helpers.to_readable_size;
  stack1 = foundHelper ? foundHelper.call(depth0, stack1, {hash:{}}) : helperMissing.call(depth0, "to_readable_size", stack1, {hash:{}});
  buffer += escapeExpression(stack1) + "<span class=\"hidden progress_container\"></span>)</a>";
  return buffer;});
Handlebars.registerPartial('feed-attachment-encrypted.hbs', Handlebars.templates['feed-attachment-encrypted.hbs']);
