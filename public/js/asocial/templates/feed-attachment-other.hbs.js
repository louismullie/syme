
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['feed-attachment-other.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function";


  buffer += "<p>\n  <b>\n    ";
  foundHelper = helpers['t'];
  stack1 = foundHelper ? foundHelper.call(depth0, "upload.attachment", {hash:{}}) : helperMissing.call(depth0, "t", "upload.attachment", {hash:{}});
  buffer += escapeExpression(stack1) + ":\n  </b>\n  ";
  foundHelper = helpers.filename;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.filename; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\n  (";
  stack1 = depth0.size;
  foundHelper = helpers.to_readable_size;
  stack1 = foundHelper ? foundHelper.call(depth0, stack1, {hash:{}}) : helperMissing.call(depth0, "to_readable_size", stack1, {hash:{}});
  buffer += escapeExpression(stack1) + ")\n  &sdot;\n  <a class='encrypted-file' data-attachment-filename='";
  foundHelper = helpers.filename;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.filename; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "' data-attachment-id='";
  foundHelper = helpers.id;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "' data-attachment-key='";
  foundHelper = helpers.key;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.key; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "' data-attachment-size='";
  foundHelper = helpers.size;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.size; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "' href='#'>\n    ";
  foundHelper = helpers.filename;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.filename; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\n    <span class='hidden progress_container'></span>\n  </a>\n  (";
  stack1 = depth0.size;
  foundHelper = helpers.to_readable_size;
  stack1 = foundHelper ? foundHelper.call(depth0, stack1, {hash:{}}) : helperMissing.call(depth0, "to_readable_size", stack1, {hash:{}});
  buffer += escapeExpression(stack1) + ")\n</p>\n";
  return buffer;});
Handlebars.registerPartial('feed-attachment-other.hbs', Handlebars.templates['feed-attachment-other.hbs']);
