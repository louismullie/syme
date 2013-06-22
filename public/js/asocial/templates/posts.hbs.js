
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['posts.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials;
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  stack1 = depth0.posts;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(2, program2, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " \n";
  return buffer;}
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  stack1 = depth0;
  stack1 = self.invokePartial(partials['feed-post'], 'feed-post', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  return buffer;}

function program4(depth0,data) {
  
  
  return "\n<div class='row empty-group-notice'>\n  <div class='span6 offset1'>\n    <h4>There are no posts yet. Break the ice!</h4>\n  </div>\n</div>\n";}

  stack1 = depth0.posts;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;});
