
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['groups-group.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n    <a class='delete-group btn btn-white hint--left' data-group-id='";
  foundHelper = helpers.id;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "' data-hint='Delete' href='#'>\n      <i class='icon-remove'></i>\n    </a>\n    ";
  return buffer;}

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  stack1 = depth0;
  stack1 = self.invokePartial(partials['groups-avatar.hbs'], 'groups-avatar.hbs', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  return buffer;}

function program5(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n    <!-- / Invite link -->\n    <a class='group-link integrate-link' data-group-name='";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "' data-hbs='' data-invite-PPA_k='";
  foundHelper = helpers.PPA_k;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.PPA_k; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "' data-invite-id='";
  foundHelper = helpers.invite_id;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.invite_id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "' data-invite-k_sA='";
  foundHelper = helpers.k_sA;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.k_sA; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "' href='/";
  foundHelper = helpers.id;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "'>\n      <!-- / data-group-name does not seem to be used -->\n      ";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "\n    </a>\n    ";
  return buffer;}

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    ";
  stack1 = depth0.new_keys;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(10, program10, data),fn:self.program(8, program8, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  return buffer;}
function program8(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n    <!-- / Confirmation link -->\n    <a class='group-link update-link' data-group-name='";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "' data-hbs='' data-invite-new_keys='";
  foundHelper = helpers.new_keys;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.new_keys; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "' href='/";
  foundHelper = helpers.id;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "'>\n      ";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "\n    </a>\n    ";
  return buffer;}

function program10(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n    <!-- / Normal link -->\n    <a class='group-link' data-hbs='' href='/";
  foundHelper = helpers.id;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "'>\n      ";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "\n    </a>\n    ";
  return buffer;}

  buffer += "<li class='group-card'>\n  <div class='group-banner'>\n    ";
  stack1 = depth0.deletable;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    <a class='group-banner-link' data-hbs='' href='/";
  foundHelper = helpers.id;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "'>\n      <!-- / Group avatar -->\n      ";
  stack1 = depth0.avatar;
  stack1 = helpers['with'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(3, program3, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </a>\n  </div>\n  <div class='group-card-content'>\n    ";
  stack1 = depth0.PPA_k;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </div>\n</li>\n";
  return buffer;});
Handlebars.registerPartial('groups-group.hbs', Handlebars.templates['groups-group.hbs']);
