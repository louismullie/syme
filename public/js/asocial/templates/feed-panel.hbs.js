
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['feed-panel.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials;
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n  <!-- / Hidden file upload -->\n  <input class='hidden' id='group-photo-file' name='avatar' type='file'>\n  <a data-placeholder='";
  foundHelper = helpers.placeholder;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.placeholder; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "' href='#' id='group-photo-edit'>\n    <span class='cover'>\n      <span><i class=\"icon-picture\"></i> Change picture</span>\n    </span>\n    ";
  stack1 = depth0.placeholder;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </a>\n  ";
  return buffer;}
function program2(depth0,data) {
  
  
  return "\n    <img src='/img/groupavatar.jpg'>\n    ";}

function program4(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n    <img alt='Encrypted image' class='encrypted-image' data-attachment-group='";
  foundHelper = helpers.group_name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.group_name; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "' data-attachment-id='";
  foundHelper = helpers.id;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "' data-attachment-key='";
  foundHelper = helpers.key;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.key; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "' data-attachment-type='image' src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'>\n    ";
  return buffer;}

  buffer += "<div id='feed-panel'>\n  ";
  stack1 = depth0.group;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.avatar;
  stack1 = helpers['with'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  <!-- / Userlist -->\n  ";
  stack1 = depth0;
  stack1 = self.invokePartial(partials['feed-users.hbs'], 'feed-users.hbs', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n";
  return buffer;});
Handlebars.registerPartial('feed-panel.hbs', Handlebars.templates['feed-panel.hbs']);
