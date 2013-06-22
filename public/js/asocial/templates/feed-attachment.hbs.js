
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['feed-attachment.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials;
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n";
  stack1 = depth0;
  stack1 = self.invokePartial(partials['feed-attachment-media.hbs'], 'feed-attachment-media.hbs', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;}

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n";
  stack1 = depth0;
  stack1 = self.invokePartial(partials['feed-attachment-other.hbs'], 'feed-attachment-other.hbs', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;}

  stack1 = depth0.is_media;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;});
Handlebars.registerPartial('feed-attachment.hbs', Handlebars.templates['feed-attachment.hbs']);
