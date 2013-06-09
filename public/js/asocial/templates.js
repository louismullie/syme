(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['_container'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials; data = data || {};
  var buffer = "", stack1, self=this;


  stack1 = self.invokePartial(partials.navbar, 'navbar', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\ndsfsdfdfsfd\n<div id='main'></div>\n<div id='footer'>\n  <div id='footer'>\n    <div id='modals'></div>\n    <div id='canvases'>\n      <canvas id='canvas'></canvas>\n    </div>\n  </div>\n</div>\n";
  return buffer;
  });
templates['_error-alert'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<div class='alert alert-error'>\n  <a class='close' data-dismiss='alert' href='#'>&times;</a>\n  "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.system),stack1 == null || stack1 === false ? stack1 : stack1.error)),stack1 == null || stack1 === false ? stack1 : stack1.message)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n</div>\n";
  return buffer;
  }

  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.system),stack1 == null || stack1 === false ? stack1 : stack1.error), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n";
  return buffer;
  });
templates['_error-forbidden'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "<div class='container'>\n  <div class='row'>\n    <div class='span8 offset2'>\n      <h1 class='enormous'>\n        ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "forbidden.title", options) : helperMissing.call(depth0, "t", "forbidden.title", options)))
    + "\n      </h1>\n      <p class='lead'>\n        ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "forbidden.text", options) : helperMissing.call(depth0, "t", "forbidden.text", options)))
    + "\n      </p>\n      <p class='text-align-right'>\n        <a class='btn btn-large' href='/'>\n          ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "forbidden.button", options) : helperMissing.call(depth0, "t", "forbidden.button", options)))
    + "\n        </a>\n      </p>\n    </div>\n  </div>\n</div>\n";
  return buffer;
  });
templates['_error-notfound'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "<div class='container'>\n  <div class='row'>\n    <div class='span8 offset2'>\n      <h1 class='enormous'>\n        ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "not_found.title", options) : helperMissing.call(depth0, "t", "not_found.title", options)))
    + "\n      </h1>\n      <p class='lead'>\n        ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "not_found.text", options) : helperMissing.call(depth0, "t", "not_found.text", options)))
    + "\n      </p>\n      <p class='text-align-right'>\n        <a class='btn btn-large' href='/'>\n          &lt; ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "not_found.button", options) : helperMissing.call(depth0, "t", "not_found.button", options)))
    + "\n        </a>\n      </p>\n    </div>\n  </div>\n</div>\n";
  return buffer;
  });
templates['_feed-attachment-embed'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<video alt='Encrypted video' class='encrypted-video' data-attachment-filename='";
  if (stack1 = helpers.filename) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.filename; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-attachment-id='";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-attachment-key='";
  if (stack1 = helpers.key) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.key; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-attachment-size='";
  if (stack1 = helpers.size) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.size; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-attachment-type='video' src=''></video>\n";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<audio alt='Encrypted audio' class='encrypted-audio' data-attachment-filename='";
  if (stack1 = helpers.filename) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.filename; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-attachment-id='";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-attachment-key='";
  if (stack1 = helpers.key) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.key; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-attachment-size='";
  if (stack1 = helpers.size) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.size; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-attachment-type='audio' src=''></audio>\n";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<a class='image-download' href='#'>\n  <img alt='Encrypted image' class='attached-image encrypted-image' data-attachment-filename='"
    + escapeExpression(((stack1 = ((stack1 = depth0.thumbnail),stack1 == null || stack1 === false ? stack1 : stack1.filename)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "' data-attachment-id='"
    + escapeExpression(((stack1 = ((stack1 = depth0.thumbnail),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "' data-attachment-key='"
    + escapeExpression(((stack1 = ((stack1 = depth0.thumbnail),stack1 == null || stack1 === false ? stack1 : stack1.key)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "' data-attachment-size='"
    + escapeExpression(((stack1 = ((stack1 = depth0.thumbnail),stack1 == null || stack1 === false ? stack1 : stack1.size)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "' data-attachment-type='image' src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'>\n</a>\n";
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, depth0.is_video, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  stack1 = helpers['if'].call(depth0, depth0.is_audio, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  stack1 = helpers['if'].call(depth0, depth0.is_image, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });
templates['_feed-attachment-encrypted'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  if (stack1 = helpers.image_size) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.image_size; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " - ";
  return buffer;
  }

  buffer += "<a class='encrypted-file' data-attachment-filename='";
  if (stack1 = helpers.filename) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.filename; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-attachment-id='";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-attachment-key='";
  if (stack1 = helpers.key) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.key; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-attachment-size='";
  if (stack1 = helpers.size) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.size; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' href='#'>"
    + escapeExpression(((stack1 = ((stack1 = depth0.attachment),stack1 == null || stack1 === false ? stack1 : stack1.filename)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n(";
  stack2 = helpers['if'].call(depth0, depth0.is_image, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.to_readable_size),stack1 ? stack1.call(depth0, depth0.size, options) : helperMissing.call(depth0, "to_readable_size", depth0.size, options)))
    + "<span class=\"hidden progress_container\"></span>)</a>";
  return buffer;
  });
templates['_feed-attachment-media'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials; data = data || {};
  var buffer = "", stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<p>\n  ";
  stack1 = helpers['if'].call(depth0, depth0.is_video, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  ";
  stack1 = helpers['if'].call(depth0, depth0.is_audio, {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  :\n  ";
  stack1 = self.invokePartial(partials['feed-attachment-encrypted'], 'feed-attachment-encrypted', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</p>\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += " ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "upload.video", options) : helperMissing.call(depth0, "t", "upload.video", options)))
    + " ";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += " ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "upload.audio", options) : helperMissing.call(depth0, "t", "upload.audio", options)))
    + " ";
  return buffer;
  }

  buffer += "<!-- / Display attachment information. -->\n";
  stack1 = helpers.unless.call(depth0, depth0.is_image, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n<!-- / Embed encrypted media. -->\n";
  stack1 = self.invokePartial(partials['feed-attachment-embed'], 'feed-attachment-embed', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });
templates['_feed-attachment-other'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function";


  buffer += "<p>\n  <b>\n    ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "upload.attachment", options) : helperMissing.call(depth0, "t", "upload.attachment", options)))
    + ":\n  </b>\n  ";
  if (stack2 = helpers.filename) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.filename; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\n  (";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.to_readable_size),stack1 ? stack1.call(depth0, depth0.size, options) : helperMissing.call(depth0, "to_readable_size", depth0.size, options)))
    + ")\n  &sdot;\n  <a class='encrypted-file' data-attachment-filename='";
  if (stack2 = helpers.filename) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.filename; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "' data-attachment-id='";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.id; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "' data-attachment-key='";
  if (stack2 = helpers.key) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.key; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "' data-attachment-size='";
  if (stack2 = helpers.size) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.size; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "' href='#'>\n    ";
  if (stack2 = helpers.filename) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.filename; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\n    <span class='hidden progress_container'></span>\n  </a>\n  (";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.to_readable_size),stack1 ? stack1.call(depth0, depth0.size, options) : helperMissing.call(depth0, "to_readable_size", depth0.size, options)))
    + ")\n</p>\n";
  return buffer;
  });
templates['_feed-attachment'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials; data = data || {};
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n";
  stack1 = self.invokePartial(partials['feed-attachment-media'], 'feed-attachment-media', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n";
  stack1 = self.invokePartial(partials['feed-attachment-other'], 'feed-attachment-other', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, depth0.is_media, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });
templates['_feed-avatar'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "\n<img class='avatar' src='/img/placeholder.gif'>\n";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<img class='avatar encrypted-avatar' data-user-id='";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'>\n";
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, depth0.placeholder, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });
templates['_feed-comment'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials; data = data || {};
  var buffer = "", stack1, stack2, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  stack1 = self.invokePartial(partials['feed-avatar'], 'feed-avatar', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "\n  <a class='comment-delete tip-icon' data-tip='Delete comment' href='#'>\n    <i class='icon-remove'></i>\n  </a>\n  ";
  }

function program5(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n    <!-- / Like action -->\n    <a class='like-action ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.likeable),stack1 == null || stack1 === false ? stack1 : stack1.liked_by_user), {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "' href='#'><span class='default-text'>Like</span><span class='active-text'>Unlike</span></a>\n    &sdot;\n    <a class='like-count' data-tip='";
  if (stack2 = helpers.liker_names) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.liker_names; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "' href='#'><span>";
  if (stack2 = helpers.like_count) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.like_count; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span>\n    Likes</a>\n    ";
  return buffer;
  }
function program6(depth0,data) {
  
  
  return "active";
  }

  buffer += "<div class='comment-box ";
  if (stack1 = helpers.hidden) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.hidden; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' id='";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>\n  ";
  stack1 = helpers['with'].call(depth0, depth0.commenter, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  <a class='commenter-name' href='#'>"
    + escapeExpression(((stack1 = ((stack1 = depth0.commenter),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\n  ";
  stack2 = helpers['if'].call(depth0, depth0.deletable, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  <div class='collapsable'>\n    <div class='encrypted'>\n      {\"content\": ";
  if (stack2 = helpers.content) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.content; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + ", \"key\": \"";
  if (stack2 = helpers.key) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.key; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\"}\n    </div>\n    <div class='encrypted_notice'>\n      <i>This comment is encrypted.</i>\n    </div>\n  </div>\n  <div class='comment-footer'>\n    <a class='time' href='#'>\n      <time class='timeago' datetime='";
  if (stack2 = helpers.full_time) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.full_time; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "'></time>\n    </a>\n    &sdot;\n    ";
  stack2 = helpers['with'].call(depth0, depth0.likeable, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  </div>\n</div>\n";
  return buffer;
  });
templates['_feed-comments'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials; data = data || {};
  var buffer = "", stack1, options, self=this, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  stack1 = self.invokePartial(partials['feed-comment'], 'feed-comment', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  return buffer;
  }

  buffer += "<div class='comments'>\n  <!-- / Show collapsed comments -->\n  <div class='show-more ";
  if (stack1 = helpers.comments_collapsed) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.comments_collapsed; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>\n    <a class='btn' href='#'>\n      Show <span>";
  if (stack1 = helpers.comments_collapsed_count) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.comments_collapsed_count; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span> hidden comments\n    </a>\n  </div>\n  <!-- / Comments -->\n  ";
  stack1 = helpers.each.call(depth0, depth0.comments, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n<!-- / Comment box -->\n<div class='comment-form'>\n  <textarea class='autogrow' maxlength='1500' name='content' placeholder='";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "feed.comment_post", options) : helperMissing.call(depth0, "t", "feed.comment_post", options)))
    + "'></textarea>\n</div>\n";
  return buffer;
  });
templates['_feed-date'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class='gutter-infos' data-timestamp='";
  if (stack1 = helpers.timestamp) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.timestamp; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>\n  <span class='abbr-date-day'>";
  if (stack1 = helpers.day) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.day; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n  <span class='abbr-date-mont'>";
  if (stack1 = helpers.month) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.month; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n  <span class='abbr-date-year'>'";
  if (stack1 = helpers.year) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.year; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n</div>\n";
  return buffer;
  });
templates['_feed-form'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials; data = data || {};
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  stack1 = self.invokePartial(partials['feed-avatar'], 'feed-avatar', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  return buffer;
  }

  buffer += "<form id='feed-form' method='post'>\n  <a id='feed-form-avatar'>\n    ";
  stack1 = helpers['with'].call(depth0, depth0.user, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </a>\n  <input class='hidden' id='upload_avatar' name='account-picture' type='file'>\n  <!-- / Drag-and-drop helper -->\n  <div id='drag-helper'>\n    <p>Drag & Drop files here</p>\n  </div>\n  <!-- / Progress bar (hidden for now) -->\n  <div class='progress progress-striped active hidden'>\n    <div class='bar' id='progress_bar'></div>\n  </div>\n  <!-- / Textarea -->\n  <textarea class='autogrow' maxlength='5000' name='content' placeholder=\"What's happening?\"></textarea>\n  <!-- / Hidden encryption-related inputs -->\n  <input id='encrypted_content' name='encrypted_content' type='hidden'>\n  <input id='mentioned_users' name='mentioned_users' type='hidden'>\n  <!-- / Hidden upload-related inputs -->\n  <input id='upload_id' name='upload_id' type='hidden'>\n  <input class='hidden' id='upload_file' type='file'>\n  <div class='row collapse'>\n    <div class='columns small-12 large-10'>\n      <!-- / Attachment box -->\n      <ul id='attachments'>\n        <li class='title'>Attach:</li>\n        <li>\n          <a data-upload-trigger='photo' href='#'>\n            <i class='icon-camera'></i>\n            Photo\n          </a>\n        </li>\n        <li>\n          <a data-upload-trigger='video' href='#'>\n            <i class='icon-film'></i>\n            Video\n          </a>\n        </li>\n        <li>\n          <a data-upload-trigger='file' href='#'>\n            <i class='icon-desktop'></i>\n            File\n          </a>\n        </li>\n      </ul>\n    </div>\n    <div class='columns small-12 large-2'>\n      <a class='btn btn-success' href='#' role='submit'>Say it</a>\n    </div>\n  </div>\n</form>\n";
  return buffer;
  });
templates['_feed-notification'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class='notification' id='";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>\n  <p class='notification-content'>\n    <a class='notification-unread' href='#' title=''>\n      <i class='icon-circle'></i>\n    </a>\n    ";
  if (stack1 = helpers.html) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.html; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </p>\n  <p class='notification-infos'>\n    ";
  if (stack1 = helpers.created_at) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.created_at; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n  </p>\n</div>\n";
  return buffer;
  });
templates['_feed-notifications-empty'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class='notification' id='";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>\n  <p class='empty-notification'>\n    No new notifications.\n  </p>\n</div>\n";
  return buffer;
  });
templates['_feed-post'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials; data = data || {};
  var buffer = "", stack1, stack2, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  stack1 = self.invokePartial(partials['feed-avatar'], 'feed-avatar', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "\n    <a class='btn btn-white post-delete' href='#'>\n      <i class='icon-remove'></i>\n    </a>\n    ";
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      ";
  stack1 = helpers['with'].call(depth0, depth0.attachment, {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      ";
  return buffer;
  }
function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  stack1 = self.invokePartial(partials['feed-attachment'], 'feed-attachment', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  return buffer;
  }

function program8(depth0,data) {
  
  
  return "active";
  }

function program10(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <a class='like-count' data-tip='";
  if (stack1 = helpers.liker_names) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.liker_names; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' href='#'><span>";
  if (stack1 = helpers.like_count) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.like_count; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n        Likes</a>\n        ";
  return buffer;
  }

  buffer += "<div class='post' data-encrypted='";
  if (stack1 = helpers.encrypted) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.encrypted; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' id='";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>\n  <!-- / Post header -->\n  <div class='post-header'>\n    <!-- / Avatar -->\n    ";
  stack1 = helpers['with'].call(depth0, depth0.owner, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    <!-- / Owner name -->\n    <p class='post-header-infos'>\n      "
    + escapeExpression(((stack1 = ((stack1 = depth0.owner),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n      <!-- / Post time -->\n      <a class='time' href='#'>\n        <time class='timeago' datetime='";
  if (stack2 = helpers.created_at) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.created_at; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "'></time>\n      </a>\n    </p>\n    <!-- / Delete button -->\n    ";
  stack2 = helpers['if'].call(depth0, depth0.deletable, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  </div>\n  <!-- / Post content -->\n  <div class='post-content'>\n    <!-- / Collapsable content -->\n    <div class='collapsable'>\n      <div class='encrypted_notice'>\n        <i>This post is encrypted.</i>\n      </div>\n      <div class='encrypted'>\n        {\"content\": ";
  if (stack2 = helpers.content) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.content; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + ", \"key\": \"";
  if (stack2 = helpers.key) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.key; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\"}\n      </div>\n    </div>\n    <!-- / Attachment -->\n    <div class='attachment'>\n      ";
  stack2 = helpers['if'].call(depth0, depth0.attachment, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </div>\n  </div>\n  <!-- / Post footer -->\n  <div class='post-footer'>\n    <div class='row'>\n      <!-- / Actions -->\n      <div class='post-footer-actions columns small-6'>\n        <!-- / Like action -->\n        <a class='like-action ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.likeable),stack1 == null || stack1 === false ? stack1 : stack1.liked_by_user), {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "' href='#'><span class='default-text'>Like</span><span class='active-text'>Unlike</span></a>\n        &sdot;\n        <!-- / Comment action -->\n        <a class='comment-action' href='#'>\n          Comment\n        </a>\n      </div>\n      <!-- / Informations -->\n      <div class='post-footer-informations columns small-6'>\n        <!-- / Like count -->\n        ";
  stack2 = helpers['with'].call(depth0, depth0.likeable, {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n        &sdot;\n        <!-- / Comment count -->\n        <span>";
  if (stack2 = helpers.comment_count) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.comment_count; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span> Comments\n      </div>\n    </div>\n  </div>\n  <div class='post-comments'>\n    ";
  stack2 = self.invokePartial(partials['feed-comments'], 'feed-comments', depth0, helpers, partials, data);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  </div>\n</div>\n";
  return buffer;
  });
templates['_feed-posts'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials; data = data || {};
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  stack1 = helpers.each.call(depth0, depth0.posts, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " \n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  stack1 = self.invokePartial(partials['feed-post'], 'feed-post', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  return buffer;
  }

function program4(depth0,data) {
  
  
  return "\n<div class='row empty-group-notice'>\n  <div class='span6 offset1'>\n    <h4>There are no posts yet. Break the ice!</h4>\n  </div>\n</div>\n";
  }

  stack1 = helpers['if'].call(depth0, depth0.posts, {hash:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });
templates['_feed-time'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<time class='timeago' datetime='";
  if (stack1 = helpers.created_at) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.created_at; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'></time>\n";
  return buffer;
  });
templates['_feed-user'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <div class='user-avatar' data-id='"
    + escapeExpression(((stack1 = ((stack1 = depth0.avatar),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "' data-key='"
    + escapeExpression(((stack1 = ((stack1 = depth0.avatar),stack1 == null || stack1 === false ? stack1 : stack1.key)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "' data-size='"
    + escapeExpression(((stack1 = ((stack1 = depth0.avatar),stack1 == null || stack1 === false ? stack1 : stack1.size)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'></div>\n  ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "\n<!-- / Nothing -->\n";
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<a class='avatar' data-tip='";
  if (stack1 = helpers.full_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.full_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' href='#'>\n  <img class='encrypted-avatar userlist-avatar' data-user-id='";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'>\n</a>\n";
  return buffer;
  }

  buffer += "<div class='user hidden' id='";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>\n  ";
  stack1 = helpers['if'].call(depth0, depth0.avatar, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n";
  stack1 = helpers['if'].call(depth0, depth0.is_current_user, {hash:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });
templates['_feed-users'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials; data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  ";
  stack1 = helpers.each.call(depth0, depth0.invite, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <a class='invite-confirm' data-invite-PA_k='";
  if (stack1 = helpers.PA_k) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.PA_k; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-invite-a_P='";
  if (stack1 = helpers.a_P) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.a_P; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-invite-id='";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-invite-invitee_id='";
  if (stack1 = helpers.invitee_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.invitee_id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-invite-k_P='";
  if (stack1 = helpers.k_P) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.k_P; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-invite-p_sB='";
  if (stack1 = helpers.p_sB) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.p_sB; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-invite-sB_salt='";
  if (stack1 = helpers.sB_salt) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.sB_salt; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-invite-token='";
  if (stack1 = helpers.token) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.token; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' href='#'>\n    Approve ";
  if (stack1 = helpers.invitee_full_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.invitee_full_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " >\n  </a>\n  ";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      ";
  stack1 = self.invokePartial(partials['feed-user'], 'feed-user', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      ";
  return buffer;
  }

  buffer += "<div id='userlist'>\n  <div id='userlist-header'>\n    <!-- / False-title / omnibar -->\n    <input id='userlist-omnibar' placeholder='Search' readonly='' type='text' value='Members (13)'>\n    <!-- / Sorting options -->\n    <div class='btn-group btn-icon-group pull-right'><a class='btn' data-tip='Sort by user photo' href='#'>\n        <i class='icon-th'></i>\n      </a><a class='btn' data-tip='Sort by name' href='#'>\n        <i class='icon-list'></i>\n      </a>\n    </div>\n    <div class='btn-group btn-icon-group pull-right' id='locked-return'><a class='btn' data-tip='Go back' href='#'>\n        <i class='icon-reply'></i>\n      </a></div>\n    <!-- / Search button -->\n    <a class='search tip-icon' data-tip='Search for users' href='#'>\n      <i class='icon-search'></i>\n    </a>\n  </div>\n  <form id='invite' method='post'>\n    <div class='invite-user'>\n      <input data-validation-regex-message=\"This doesn't look like an e-mail.\" data-validation-regex-regex='^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$' id='email' maxlength='30' name='email' required='' type='text'>\n      <input class='btn btn-info' type='submit' value='";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "admin.invite", options) : helperMissing.call(depth0, "t", "admin.invite", options)))
    + "'>\n    </div>\n    <div class='invited-user hidden'>\n      Your invite has been sent.\n    </div>\n  </form>\n  ";
  stack2 = helpers['if'].call(depth0, depth0.invite, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  <div class='sorted-by-picture' id='list'>\n    <div id='list-container'>\n      ";
  stack2 = helpers.each.call(depth0, depth0.users, {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n      <!-- / Invite link is like a normal avatar -->\n      <a class='avatar invite-toggle' href='#'>\n        <!-- / 1x1 transparent -->\n        <img src='data:image/gif;base64,R0lGODlhAQABAIAAAP7//wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='>\n        <i class='icon-plus-sign'></i>\n      </a>\n    </div>\n  </div>\n</div>\n";
  return buffer;
  });
templates['_feed'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials; data = data || {};
  var buffer = "", stack1, stack2, options, self=this, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  stack1 = self.invokePartial(partials['feed-avatar'], 'feed-avatar', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <!-- / Begin: Move that out of here -->\n      ";
  stack1 = helpers['if'].call(depth0, depth0.placeholder, {hash:{},inverse:self.program(6, program6, data),fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      <!-- / End: Move that out of here -->\n      ";
  return buffer;
  }
function program4(depth0,data) {
  
  
  return "\n      <img class='group-avatar'>\n      ";
  }

function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <img alt='Encrypted image' class='group-avatar encrypted-image' data-attachment-group='";
  if (stack1 = helpers.group_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.group_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-attachment-id='";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-attachment-key='";
  if (stack1 = helpers.key) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.key; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-attachment-type='image' src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'>\n      ";
  return buffer;
  }

  buffer += "<div class='row'>\n  <!-- / Left column -->\n  <div class='columns small-12 large-5 large-offset-2'>\n    <!-- / Feed form -->\n    <div class='row'>\n      <div class='small-12 collapse'>\n        <form id='feed-form' method='post'>\n          <a id='feed-form-avatar'>\n            ";
  stack1 = helpers['with'].call(depth0, depth0.user, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          </a>\n          <input class='hidden' id='upload_avatar' name='account-picture' type='file'>\n          <!-- / Drag-and-drop helper -->\n          <div id='drag-helper'>\n            <p>Drag & Drop files here</p>\n          </div>\n          <!-- / Progress bar (hidden for now) -->\n          <div class='progress progress-striped active hidden'>\n            <div class='bar' id='progress_bar'></div>\n          </div>\n          <!-- / Textarea -->\n          <textarea class='autogrow' maxlength='5000' name='content' placeholder=\"What's happening?\"></textarea>\n          <!-- / Hidden encryption-related inputs -->\n          <input id='encrypted_content' name='encrypted_content' type='hidden'>\n          <input id='mentioned_users' name='mentioned_users' type='hidden'>\n          <!-- / Hidden upload-related inputs -->\n          <input id='upload_id' name='upload_id' type='hidden'>\n          <input class='hidden' id='upload_file' type='file'>\n          <div class='row collapse'>\n            <div class='columns small-12 large-10'>\n              <!-- / Attachment box -->\n              <ul id='attachments'>\n                <li class='title'>Attach:</li>\n                <li>\n                  <a data-upload-trigger='photo' href='#'>\n                    <i class='icon-camera'></i>\n                    Photo\n                  </a>\n                </li>\n                <li>\n                  <a data-upload-trigger='video' href='#'>\n                    <i class='icon-film'></i>\n                    Video\n                  </a>\n                </li>\n                <li>\n                  <a data-upload-trigger='file' href='#'>\n                    <i class='icon-desktop'></i>\n                    File\n                  </a>\n                </li>\n              </ul>\n            </div>\n            <div class='columns small-12 large-2'>\n              <a class='btn btn-success' href='#' role='submit'>Say it</a>\n            </div>\n          </div>\n        </form>\n      </div>\n    </div>\n    <!-- / Feed -->\n    <div data-month='";
  if (stack1 = helpers.month) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.month; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-year='";
  if (stack1 = helpers.year) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.year; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' id='feed'>\n      <!-- / New content button -->\n      <div id='newcontent'>\n        <a class='btn' href='#'>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "new_content", options) : helperMissing.call(depth0, "t", "new_content", options)))
    + " (<span></span>)</a>\n      </div>\n      <!-- / Feed errors -->\n      ";
  stack2 = self.invokePartial(partials['error-alert'], 'error-alert', depth0, helpers, partials, data);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n      <!-- / Posts loop -->\n      ";
  stack2 = self.invokePartial(partials['feed-posts'], 'feed-posts', depth0, helpers, partials, data);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </div>\n    <!-- / Load more button, triggered by infinite scroller -->\n    <!-- / every few pages -->\n    <div id='load-more'>\n      <a class='btn' href='#'>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "feed.load_more", options) : helperMissing.call(depth0, "t", "feed.load_more", options)))
    + "</a>\n    </div>\n  </div>\n  <!-- / Group panel -->\n  <div class='columns small-12 large-3 end' id='feed-panel'>\n    <!-- / Group name -->\n    <h1>\n      "
    + escapeExpression(((stack1 = ((stack1 = depth0.group),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </h1>\n    <!-- / Group avatar -->\n    <a data-tip='Change your group picture'>\n      ";
  stack2 = helpers['with'].call(depth0, ((stack1 = depth0.group),stack1 == null || stack1 === false ? stack1 : stack1.avatar), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </a>\n    <!-- / Group avatar hidden file upload -->\n    <form>\n      <input class='hidden' id='group-avatar-file-input' name='avatar' type='file'>\n    </form>\n    <!-- / Userlist -->\n    ";
  stack2 = self.invokePartial(partials['feed-users'], 'feed-users', depth0, helpers, partials, data);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  </div>\n</div>\n";
  return buffer;
  });
templates['_groups-avatar'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "\n<img class='placeholder' src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'>\n";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<img class='encrypted-background-image' data-attachment-group='";
  if (stack1 = helpers.group_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.group_id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-attachment-id='";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-attachment-key='";
  if (stack1 = helpers.key) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.key; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'>\n";
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, depth0.placeholder, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });
templates['_groups-create'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<li class='group-card group-create opened'>\n  <a class='group-card-title'>\n    Create group\n    <i class='icon-chevron-down'></i>\n  </a>\n  <div class='group-card-content'>\n    <form class='row' id='create_group' method='post'>\n      <div class='tight columns small-12 large-7'>\n        <input autocapitalize='off' autocomplete='off' autocorrect='off' name='name' placeholder='Enter a group name' spellcheck='false' type='text'>\n      </div>\n      <div class='tight columns small-12 large-5'>\n        <a class='btn btn-white' href='#' role='submit'>Create</a>\n      </div>\n    </form>\n  </div>\n</li>\n";
  });
templates['_groups-create_first'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<div class='create-first-group'>\n  <h2>Welcome to <b>Asocial</b>. <br/>Name your first group:</h2>\n  <div class='row'>\n    <div class='columns small-12 large-8 large-centered'>\n      <form id='create_first_group' method='post'>\n        <input autocapitalize='off' autocomplete='off' autocorrect='off' autofocus='' name='name' spellcheck='false' type='text'>\n        <a href='#' role='submit'>\n          <span class='default'>Get started</span>\n          <span class='hover'><i class=\"icon-ok\"></i></span>\n        </a>\n      </form>\n    </div>\n  </div>\n</div>\n";
  });
templates['_groups-group'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <a class='delete-group btn btn-white' data-group-id='";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' href='#'>\n      <i class='icon-remove'></i>\n    </a>\n    ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  stack1 = self.invokePartial(partials['groups-avatar'], 'groups-avatar', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <!-- / Invite link -->\n    <a class='group-link integrate-link' data-group-name='";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-hbs='' data-invite-PPA_k='";
  if (stack1 = helpers.PPA_k) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.PPA_k; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-invite-id='";
  if (stack1 = helpers.invite_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.invite_id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-invite-k_sA='";
  if (stack1 = helpers.k_sA) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.k_sA; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' href='/";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>\n      <!-- / data-group-name does not seem to be used -->\n      ";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n    </a>\n    ";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    ";
  stack1 = helpers['if'].call(depth0, depth0.new_keys, {hash:{},inverse:self.program(10, program10, data),fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  return buffer;
  }
function program8(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <!-- / Confirmation link -->\n    <a class='group-link update-link' data-group-name='";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-hbs='' data-invite-new_keys='";
  if (stack1 = helpers.new_keys) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.new_keys; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' href='/";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>\n      ";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n    </a>\n    ";
  return buffer;
  }

function program10(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <!-- / Normal link -->\n    <a class='group-link' data-hbs='' href='/";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>\n      ";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n    </a>\n    ";
  return buffer;
  }

  buffer += "<li class='group-card'>\n  <div class='group-banner'>\n    ";
  stack1 = helpers['if'].call(depth0, depth0.deletable, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    <a class='group-banner-link' data-hbs='' href='/";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>\n      <!-- / Group avatar -->\n      ";
  stack1 = helpers['with'].call(depth0, depth0.avatar, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </a>\n  </div>\n  <div class='group-card-content'>\n    ";
  stack1 = helpers['if'].call(depth0, depth0.PPA_k, {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </div>\n</li>\n";
  return buffer;
  });
templates['_groups-invites'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n";
  stack1 = helpers.each.call(depth0, depth0.invites, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<li class='group-card group-invite'>\n  <div class='group-banner'>\n    <a class='group-banner-link invite-link' data-invite-p='";
  if (stack1 = helpers['P']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0['P']; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-invite-question='";
  if (stack1 = helpers.question) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.question; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-invite-token='";
  if (stack1 = helpers.token) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.token; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' href='#'>\n      <span>Click to accept</span>\n      <img class='placeholder' src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'>\n    </a>\n  </div>\n  <div class='group-card-content'>\n    <p>\n      <b>";
  if (stack1 = helpers.inviter_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.inviter_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</b> has invited you to join the group <b>";
  if (stack1 = helpers.group_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.group_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</b>.\n    </p>\n  </div>\n</li>\n";
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, depth0.invites, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });
templates['_groups'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials; data = data || {};
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <ul>\n      <!-- / Invitations -->\n      ";
  stack1 = self.invokePartial(partials['groups-invites'], 'groups-invites', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      <!-- / Create group -->\n      ";
  stack1 = self.invokePartial(partials['groups-create'], 'groups-create', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      <!-- / Group Loop -->\n      ";
  stack1 = helpers.each.call(depth0, depth0.groups, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </ul>\n    ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  stack1 = self.invokePartial(partials['groups-group'], 'groups-group', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    ";
  stack1 = helpers['if'].call(depth0, depth0.groups, {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  return buffer;
  }
function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <ul>\n      <!-- / Create group -->\n      ";
  stack1 = self.invokePartial(partials['groups-create'], 'groups-create', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      <!-- / Group Loop -->\n      ";
  stack1 = helpers.each.call(depth0, depth0.groups, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </ul>\n    ";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <!-- / First group creation -->\n    ";
  stack1 = self.invokePartial(partials['groups-create_first'], 'groups-create_first', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  return buffer;
  }

  buffer += "<div class='row' id='groups'>\n  <div class='small-12 large-8 large-centered columns'>\n    ";
  stack1 = helpers['if'].call(depth0, depth0.invites, {hash:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </div>\n</div>\n";
  return buffer;
  });
templates['_index'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "&nbsp;\n";
  });
templates['_invite-update'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<script src='/js/asocial/update.js'></script>\n<script src='/js/asocial/headers.js'></script>\nDo you want to add a new person to your key list?\n<form id='update'>\n  <button>Confirm</button>\n</form>\n";
  });
templates['_login'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "<div class='row' id='auth'>\n  <div class='columns small-12 large-8 large-centered'>\n    <h1>Asocial</h1>\n    <h2>The encrypted social network.</h2>\n    <div class='row' id='auth-methods'>\n      <div class='columns small-12 large-6 large-centered'>\n        <form id='login-form' method='post'>\n          <!-- / Error message -->\n          <div class='hidden' id='error'>\n            <i class='icon-warning-sign'></i>\n            <span></span>\n          </div>\n          <div class='input-text-icon'>\n            <i class='icon-envelope'></i>\n            <input name='email' placeholder='Email' type='text'>\n          </div>\n          <div class='input-text-icon'>\n            <i class='icon-lock'></i>\n            <input name='password' placeholder='";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "login.password", options) : helperMissing.call(depth0, "t", "login.password", options)))
    + "' type='password'>\n          </div>\n          <label for='remember_me'>\n            <input id='remember_me' name='remember_me' type='checkbox'>\n            <span>Keep me logged in</span>\n          </label>\n          <a class='btn btn-success' href='#' role='submit'>\n            Log in <i class=\"icon-spinner icon-spin\"></i>\n          </a>\n          <p class='switchmode'>\n            Need an account? <a href=\"/register\" data-hbs>Create one</a>.\n          </p>\n        </form>\n      </div>\n    </div>\n  </div>\n</div>\n";
  return buffer;
  });
templates['_navbar'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<div id='navbar'>\n  <div class='row'>\n    <div class='small-12'>\n      <ul>\n        <li>\n          <a data-hbs='' href='/' id='brand'>\n            Asocial\n          </a>\n        </li>\n        <li>\n          <a class='btn' data-popover='notifications-container' href='#' id='notifications'>\n            <i class='icon-bell-alt'></i>\n          </a>\n          <div class='popover' id='notifications-container'>\n            <h3>Notifications</h3>\n            <div id='notifications-content'></div>\n          </div>\n        </li>\n        <div class='pull-right'>\n          <li>\n            <a class='btn' data-hbs='' href='/settings'>\n              <i class='icon-cog'></i>\n            </a>\n          </li>\n          <li>\n            <a class='btn' href='/logout'>\n              <i class='icon-signout'></i>\n            </a>\n          </li>\n        </div>\n      </ul>\n    </div>\n  </div>\n</div>\n";
  });
templates['_register'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "<div class='row' id='auth'>\n  <div class='columns small-12 large-8 large-centered'>\n    <h1>Asocial</h1>\n    <h2>The encrypted social network.</h2>\n    <div class='row' id='auth-methods'>\n      <div class='columns small-12 large-6 large-centered'>\n        <form id='register-form' method='post'>\n          <div class='hidden' id='error'>\n            <i class='icon-warning-sign'></i>\n            <span></span>\n          </div>\n          <div class='input-text-icon'>\n            <i class='icon-user'></i>\n            <input autocapitalize='off' autocomplete='off' autocorrect='off' name='full_name' placeholder='Full name' spellcheck='false' type='text'>\n          </div>\n          <div class='input-text-icon'>\n            <i class='icon-envelope'></i>\n            <input autocapitalize='off' autocomplete='off' autocorrect='off' name='email' placeholder='Email address' spellcheck='false' type='text'>\n          </div>\n          <div class='input-text-icon'>\n            <i class='icon-lock'></i>\n            <input name='password' placeholder='";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "login.password", options) : helperMissing.call(depth0, "t", "login.password", options)))
    + "' type='password'>\n          </div>\n          <a class='btn btn-success' href='#' role='submit'>\n            Register <i class=\"icon-spinner icon-spin\"></i>\n          </a>\n          <p class='switchmode'>\n            Already registered? <a href=\"/login\" data-hbs>Log in</a>.\n          </p>\n        </form>\n      </div>\n    </div>\n  </div>\n</div>\n";
  return buffer;
  });
templates['_settings-profile'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function";


  buffer += "<form class='form-horizontal' id='settings' method='post'>\n  <div class='pull-left'>\n    <div class='control-group'>\n      <label class='control-label' for='first_name'>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "settings.first_name", options) : helperMissing.call(depth0, "t", "settings.first_name", options)))
    + ":</label>\n      <div class='controls'>\n        <input data-validation-maxlength-message='This name is a bit too long. Do you have a shorter one?' data-validation-regex-message=\"This doesn't look like a name\" data-validation-regex-regex='[A-ZÉ][a-zéèê]+([- ][A-ZÉ][a-zéèê]*)?' maxlength='30' name='first_name' placeholder='"
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.first_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "' type='text'>\n      </div>\n    </div>\n    <div class='control-group'>\n      <label class='control-label' for='last_name'>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "settings.last_name", options) : helperMissing.call(depth0, "t", "settings.last_name", options)))
    + ":</label>\n      <div class='controls'>\n        <input data-validation-maxlength-message='This name is a bit too long. Do you have a shorter one?' data-validation-regex-message=\"This doesn't look like a name\" data-validation-regex-regex='[A-ZÉ][a-zéèê]+([- ][A-ZÉ][a-zéèê]*)?' maxlength='30' name='last_name' placeholder='"
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.last_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "' type='text'>\n      </div>\n    </div>\n  </div>\n  <div class='pull-right clearfix'>\n    <input class='btn btn-info' type='submit' value='";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "settings.update_button", options) : helperMissing.call(depth0, "t", "settings.update_button", options)))
    + "'>\n  </div>\n</form>\n";
  return buffer;
  });
templates['_settings-settings'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "settings.settings", options) : helperMissing.call(depth0, "t", "settings.settings", options)))
    + "\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "settings.delete_account", options) : helperMissing.call(depth0, "t", "settings.delete_account", options)))
    + "\n";
  return buffer;
  });
templates['_settings'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function";


  buffer += "<div class='row'>\n  <div class='span8 offset2'>\n    <h2>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "settings.title", options) : helperMissing.call(depth0, "t", "settings.title", options)))
    + "</h2>\n    <div id='error-container'></div>\n    <p>\n      <b>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "settings.welcome", options) : helperMissing.call(depth0, "t", "settings.welcome", options)))
    + ", "
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "!</b>\n      ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "settings.explanation", options) : helperMissing.call(depth0, "t", "settings.explanation", options)))
    + "\n    </p>\n    ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "settings.informations", options) : helperMissing.call(depth0, "t", "settings.informations", options)))
    + "\n    <div class='tab-content'>\n      <div class='tab-pane active' id='tab-informations'>\n        <form class='form-horizontal' id='settings' method='post'>\n          <div class='pull-left'>\n            <div class='control-group'>\n              <label class='control-label' for='first_name'>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "settings.first_name", options) : helperMissing.call(depth0, "t", "settings.first_name", options)))
    + ":</label>\n              <div class='controls'>\n                <input data-validation-maxlength-message='This name is a bit too long. Do you have a shorter one?' data-validation-regex-message=\"This doesn't look like a name\" data-validation-regex-regex='[A-ZÉ][a-zéèê]+([- ][A-ZÉ][a-zéèê]*)?' maxlength='30' name='first_name' placeholder='"
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.first_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "' type='text'>\n              </div>\n            </div>\n            <div class='control-group'>\n              <label class='control-label' for='last_name'>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "settings.last_name", options) : helperMissing.call(depth0, "t", "settings.last_name", options)))
    + ":</label>\n              <div class='controls'>\n                <input data-validation-maxlength-message='This name is a bit too long. Do you have a shorter one?' data-validation-regex-message=\"This doesn't look like a name\" data-validation-regex-regex='[A-ZÉ][a-zéèê]+([- ][A-ZÉ][a-zéèê]*)?' maxlength='30' name='last_name' placeholder='"
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.last_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "' type='text'>\n              </div>\n            </div>\n          </div>\n          <div class='pull-right clearfix'>\n            <input class='btn btn-info' type='submit' value='";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "settings.update_button", options) : helperMissing.call(depth0, "t", "settings.update_button", options)))
    + "'>\n          </div>\n        </form>\n      </div>\n      <div class='tab-pane' id='tab-settings'>\n        ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "settings.settings", options) : helperMissing.call(depth0, "t", "settings.settings", options)))
    + "\n        ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "settings.delete_account", options) : helperMissing.call(depth0, "t", "settings.delete_account", options)))
    + "\n      </div>\n    </div>\n  </div>\n</div>\n";
  return buffer;
  });
templates['_system-passcode'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<div class='custom-modal container-fluid' id='passphrase-modal'>\n  <div class='row-fluid'>\n    <div class='passphrase-modal-inner custom-modal-inner span8 offset2'>\n      <i class='icon-lock huge-icon'></i>\n      <p class='lead'>Please enter your secret passcode:</p>\n      <div class='control-group'>\n        <input id='passphrase' type='password'>\n      </div>\n      <p>\n        <a class='btn' id='passphrase-submit'>Decrypt my content</a>\n      </p>\n    </div>\n  </div>\n</div>\n";
  });
})();