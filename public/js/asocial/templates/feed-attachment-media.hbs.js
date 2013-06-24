
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['feed-attachment-media.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials;
  var buffer = "", stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<p>\n  ";
  stack1 = depth0.is_video;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(2, program2, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  ";
  stack1 = depth0.is_audio;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(4, program4, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  :\n  ";
  stack1 = depth0;
  stack1 = self.invokePartial(partials['feed-attachment-encrypted.hbs'], 'feed-attachment-encrypted.hbs', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</p>\n";
  return buffer;}
function program2(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += " ";
  foundHelper = helpers['t'];
  stack1 = foundHelper ? foundHelper.call(depth0, "upload.video", {hash:{}}) : helperMissing.call(depth0, "t", "upload.video", {hash:{}});
  buffer += escapeExpression(stack1) + " ";
  return buffer;}

function program4(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += " ";
  foundHelper = helpers['t'];
  stack1 = foundHelper ? foundHelper.call(depth0, "upload.audio", {hash:{}}) : helperMissing.call(depth0, "t", "upload.audio", {hash:{}});
  buffer += escapeExpression(stack1) + " ";
  return buffer;}

  buffer += "<!-- / Display attachment information. -->\n";
  stack1 = depth0.is_image;
  stack1 = helpers.unless.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n<!-- / Embed encrypted media. -->\n";
  stack1 = depth0;
  stack1 = self.invokePartial(partials['feed-attachment-embed.hbs'], 'feed-attachment-embed.hbs', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;});
Handlebars.registerPartial('feed-attachment-media.hbs', Handlebars.templates['feed-attachment-media.hbs']);
