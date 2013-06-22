
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['groups.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials;
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <ul>\n      <!-- / Invitations -->\n      ";
  stack1 = depth0;
  stack1 = self.invokePartial(partials['groups-invites.hbs'], 'groups-invites.hbs', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      <!-- / Create group -->\n      ";
  stack1 = depth0;
  stack1 = self.invokePartial(partials['groups-create.hbs'], 'groups-create.hbs', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      <!-- / Group Loop -->\n      ";
  stack1 = depth0.groups;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(2, program2, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </ul>\n    ";
  return buffer;}
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  stack1 = depth0;
  stack1 = self.invokePartial(partials['groups-group.hbs'], 'groups-group.hbs', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  return buffer;}

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    ";
  stack1 = depth0.groups;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(8, program8, data),fn:self.program(5, program5, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  return buffer;}
function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <ul>\n      <!-- / Create group -->\n      ";
  stack1 = depth0;
  stack1 = self.invokePartial(partials['groups-create.hbs'], 'groups-create.hbs', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      <!-- / Group Loop -->\n      ";
  stack1 = depth0.groups;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(6, program6, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </ul>\n    ";
  return buffer;}
function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  stack1 = depth0;
  stack1 = self.invokePartial(partials['groups-group.hbs'], 'groups-group.hbs', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  return buffer;}

function program8(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <!-- / First group creation -->\n    ";
  stack1 = depth0;
  stack1 = self.invokePartial(partials['groups-first.hbs'], 'groups-first.hbs', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  return buffer;}

  buffer += "<div class='row' id='groups'>\n  <div class='small-24 large-16 large-centered columns'>\n    ";
  stack1 = depth0.invites;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </div>\n</div>\n";
  return buffer;});
Handlebars.registerPartial('groups.hbs', Handlebars.templates['groups.hbs']);
