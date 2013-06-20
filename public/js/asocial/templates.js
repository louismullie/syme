(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['_alert'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "\n  <a href='#' role='close-modal'>\n    <i class='icon-remove-sign'></i>\n  </a>\n  ";
  }

  buffer += "<div class='modal-title'>\n  ";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n  ";
  stack1 = helpers['if'].call(depth0, depth0.closable, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n<div class='modal-content'>\n  ";
  if (stack1 = helpers.content) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.content; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n  <a class='submit' href='#' role='close-modal'>\n    ";
  if (stack1 = helpers.submit) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.submit; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n  </a>\n</div>\n";
  return buffer;
  });
templates['_container'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials; data = data || {};
  var buffer = "", stack1, self=this;


  buffer += "<div id='spinner'>\n  <i class='icon-spinner icon-spin'></i>\n</div>\n";
  stack1 = self.invokePartial(partials.navbar, 'navbar', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n<div id='main'></div>\n<div id='footer'>\n  <div id='footer'>\n    <div id='modals'></div>\n    <div id='canvases'>\n      <canvas id='canvas'></canvas>\n    </div>\n  </div>\n</div>\n";
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
  
  
  return "\n  <a class='comment-delete tip-icon' data-hint='Delete' href='#'>\n    <i class='icon-remove'></i>\n  </a>\n  ";
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <!-- / Like action -->\n    <a class='like-action ";
  stack1 = helpers['if'].call(depth0, depth0.liked_by_user, {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "' href='#'><span class='default-text'>Like</span><span class='active-text'>Unlike</span></a>\n    &sdot;\n    <a class='like-count hint--top' data-hint='";
  if (stack1 = helpers.liker_names) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.liker_names; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' href='#'><span>";
  if (stack1 = helpers.like_count) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.like_count; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n    <i class='icon-thumbs-up-alt'></i></a>\n    ";
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
    + "'></time>\n    </a>\n    ";
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
    + "'>\n    <a href='#'>\n      <i class='icon-comment-alt'></i>\n      View <span>";
  if (stack1 = helpers.comments_collapsed_count) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.comments_collapsed_count; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span> more comments\n    </a>\n  </div>\n  <!-- / Comments -->\n  ";
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

  buffer += "<form id='feed-form' method='post'>\n  <a id='feed-form-avatar'>\n    <span>\n      <i class='icon-picture'></i>\n    </span>\n    ";
  stack1 = helpers['with'].call(depth0, depth0.user, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </a>\n  <input class='hidden' id='upload_avatar' name='account-picture' type='file'>\n  <!-- / Drag-and-drop helper -->\n  <div id='drag-helper'>\n    <p>Drag & Drop files here</p>\n  </div>\n  <!-- / Progress bar (hidden for now) -->\n  <div class='progress progress-striped active hidden'>\n    <div class='bar' id='progress_bar'></div>\n  </div>\n  <!-- / Textarea -->\n  <div id='textarea-holder'>\n    <textarea class='autogrow' maxlength='5000' name='content' placeholder=\"What's happening?\"></textarea>\n  </div>\n  <!-- / Hidden encryption-related inputs -->\n  <input id='encrypted_content' name='encrypted_content' type='hidden'>\n  <input id='mentioned_users' name='mentioned_users' type='hidden'>\n  <!-- / Hidden upload-related inputs -->\n  <input id='upload_id' name='upload_id' type='hidden'>\n  <input class='hidden' id='upload_file' type='file'>\n  <div id='upload-box'>\n    <div class='upload-row'>\n      <span class='icon'>\n        <i class='icon-spinner icon-spin'></i>\n      </span>\n      <span class='filename'></span>\n      <span class='filesize'></span>\n      <a class='delete-upload hint--left' data-hint='Remove' href='#'>\n        <i class='icon-remove'></i>\n      </a>\n    </div>\n  </div>\n  <div class='row collapse'>\n    <div class='columns small-24 large-20'>\n      <!-- / Attachment box -->\n      <ul id='attachments'>\n        <li class='title'>Attach:</li>\n        <li>\n          <a data-upload-trigger='photo' href='#'>\n            <i class='icon-camera'></i>\n            Photo\n          </a>\n        </li>\n        <li>\n          <a data-upload-trigger='video' href='#'>\n            <i class='icon-film'></i>\n            Video\n          </a>\n        </li>\n        <li>\n          <a data-upload-trigger='file' href='#'>\n            <i class='icon-file'></i>\n            File\n          </a>\n        </li>\n      </ul>\n    </div>\n    <div class='columns small-24 large-4'>\n      <a class='btn btn-success' href='#' role='submit'>Post</a>\n    </div>\n  </div>\n</form>\n";
  return buffer;
  });
templates['_feed-modals-add_user'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "Invite a user!\n";
  });
templates['_feed-modals-invite'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<div class='modal-title'>\n  Invite a user\n  <a class='hint--left' data-hint='Close' href='#' role='close-modal'>\n    <i class='icon-remove-sign'></i>\n  </a>\n</div>\n<div class='modal-content'>\n  <p class='header'>\n    Enter the email address of the person you want to invite\n    to your group below.\n  </p>\n  <p class='explanation'>\n    Your invitee will be asked to answer your group's\n    <span class=\"secret-question\" title=\"The real secret question\">secret question</span>\n    in order to join the group. If the answer is incorrect,\n    we will transmit the answer to you so that you can review\n    it manually.\n  </p>\n  <form action='post'>\n    <input name='email' placeholder='Enter an email' type='text'>\n    <a class='modal-button' href='#' role='submit'>\n      <span class='invite'>\n        Invite\n      </span>\n      <span class='spinner'>\n        <i class='icon-spinner icon-spin'></i>\n      </span>\n    </a>\n  </form>\n</div>\n";
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
  


  return "<div class='notification' id='empty'>\n  <p class='empty-notification'>\n    No new notifications.\n  </p>\n</div>\n";
  });
templates['_feed-panel'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials; data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <!-- / Hidden file upload -->\n  <input class='hidden' id='group-photo-file' name='avatar' type='file'>\n  <a data-placeholder='";
  if (stack1 = helpers.placeholder) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.placeholder; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' href='#' id='group-photo-edit'>\n    <span class='cover'>\n      <span><i class=\"icon-picture\"></i> Change picture</span>\n    </span>\n    ";
  stack1 = helpers['if'].call(depth0, depth0.placeholder, {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </a>\n  ";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return "\n    <img src='/img/groupavatar.jpg'>\n    ";
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <img alt='Encrypted image' class='encrypted-image' data-attachment-group='";
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
    + "' data-attachment-type='image' src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'>\n    ";
  return buffer;
  }

  buffer += "<div id='feed-panel'>\n  ";
  stack2 = helpers['with'].call(depth0, ((stack1 = depth0.group),stack1 == null || stack1 === false ? stack1 : stack1.avatar), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  <!-- / Userlist -->\n  ";
  stack2 = self.invokePartial(partials['feed-users'], 'feed-users', depth0, helpers, partials, data);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n</div>\n";
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
  
  
  return "\n      <a class='btn btn-white post-delete hint--left' data-hint='Delete' href='#'>\n        <i class='icon-remove'></i>\n      </a>\n      ";
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <div class='attachment'>\n        ";
  stack1 = helpers['with'].call(depth0, depth0.attachment, {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </div>\n      ";
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
  buffer += "\n          <a class='like-count hint--top' data-hint='";
  if (stack1 = helpers.liker_names) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.liker_names; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' href='#'><span>";
  if (stack1 = helpers.like_count) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.like_count; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n          Likes</a>\n          ";
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
    + "'>\n  <!-- / Avatar -->\n  ";
  stack1 = helpers['with'].call(depth0, depth0.owner, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  <div class='post-indent'>\n    <!-- / Post header -->\n    <div class='post-header'>\n      <!-- / Owner name -->\n      <p class='post-header-infos'>\n        "
    + escapeExpression(((stack1 = ((stack1 = depth0.owner),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n        <!-- / Post time -->\n        <a class='time' href='#'>\n          <time class='timeago' datetime='";
  if (stack2 = helpers.created_at) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.created_at; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "'></time>\n        </a>\n      </p>\n      <!-- / Delete button -->\n      ";
  stack2 = helpers['if'].call(depth0, depth0.deletable, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </div>\n    <!-- / Post content -->\n    <div class='post-content'>\n      <!-- / Collapsable content -->\n      <div class='collapsable'>\n        <div class='encrypted_notice'>\n          <i>This post is encrypted.</i>\n        </div>\n        <div class='encrypted'>\n          {\"content\": ";
  if (stack2 = helpers.content) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.content; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + ", \"key\": \"";
  if (stack2 = helpers.key) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.key; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\"}\n        </div>\n      </div>\n      <!-- / Attachment -->\n      ";
  stack2 = helpers['if'].call(depth0, depth0.attachment, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </div>\n    <!-- / Post footer -->\n    <div class='post-footer'>\n      <div class='row'>\n        <!-- / Actions -->\n        <div class='post-footer-actions columns small-12'>\n          <!-- / Like action -->\n          <a class='like-action ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.likeable),stack1 == null || stack1 === false ? stack1 : stack1.liked_by_user), {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "' href='#'><span class='default-text'>Like</span><span class='active-text'>Unlike</span></a>\n          &sdot;\n          <!-- / Comment action -->\n          <a class='comment-action' href='#'>\n            Comment\n          </a>\n        </div>\n        <!-- / Informations -->\n        <div class='post-footer-informations columns small-12'>\n          <!-- / Like count -->\n          ";
  stack2 = helpers['with'].call(depth0, depth0.likeable, {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n          &sdot;\n          <!-- / Comment count -->\n          <span class='comment-count'>";
  if (stack2 = helpers.comment_count) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.comment_count; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span>\n          Comments\n        </div>\n      </div>\n    </div>\n    <div class='post-comments'>\n      ";
  stack2 = self.invokePartial(partials['feed-comments'], 'feed-comments', depth0, helpers, partials, data);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </div>\n  </div>\n</div>\n";
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
  
  
  return "current";
  }

  buffer += "<li id='";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>\n  <!-- / Every user avatar is pulled from this, however it is -->\n  <!-- / stylistically obsolete. To remove. -->\n  ";
  stack1 = helpers['if'].call(depth0, depth0.avatar, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  <a class='";
  stack1 = helpers['if'].call(depth0, depth0.is_current_user, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "' data-tip='";
  if (stack1 = helpers.full_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.full_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' href='#'>\n    <img class='encrypted-avatar userlist-avatar' data-user-id='";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'>\n    <span title='";
  if (stack1 = helpers.full_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.full_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>";
  if (stack1 = helpers.full_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.full_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n  </a>\n</li>\n";
  return buffer;
  });
templates['_feed-users'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials; data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <div id='invites'>\n    ";
  stack1 = helpers.each.call(depth0, depth0.invite, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </div>\n  ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <li class='invite'>\n      <div id='invites-header'>Awaiting confirmation</div>\n      <!-- / Replace by GET request with only invite ID, which returns the rest. -->\n      <a class='invite-confirm' data-invite-PA_k='";
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
    + "' href='#'>\n        <img class='placeholder-avatar' src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'>\n        <span title='";
  if (stack1 = helpers.invitee_full_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.invitee_full_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>";
  if (stack1 = helpers.invitee_full_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.invitee_full_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n      </a>\n    </li>\n    ";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  ";
  stack1 = self.invokePartial(partials['feed-user'], 'feed-user', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  ";
  return buffer;
  }

  buffer += "<h4>\n  Members ("
    + escapeExpression(((stack1 = ((stack1 = depth0.users),stack1 == null || stack1 === false ? stack1 : stack1.length)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ")\n  <span class='actions'>\n    <a class='btn btn-white hint--left' data-hint='Add user' href='#' id='add-user'>\n      <i class='icon-plus'></i>\n    </a>\n  </span>\n</h4>\n<ul class='scrollable' id='userlist'>\n  <!-- / Invite confirmations -->\n  ";
  stack2 = helpers['if'].call(depth0, depth0.invite, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  <!-- / User list -->\n  ";
  stack2 = helpers.each.call(depth0, depth0.users, {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n</ul>\n";
  return buffer;
  });
templates['_feed'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials; data = data || {};
  var buffer = "", stack1, stack2, options, self=this, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "<div class='row'>\n  <div id='feed-column'>\n    <!-- / Feed form -->\n    ";
  stack1 = self.invokePartial(partials['feed-form'], 'feed-form', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    <!-- / Feed -->\n    <div data-group-name='"
    + escapeExpression(((stack1 = ((stack1 = depth0.group),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "' data-month='";
  if (stack2 = helpers.month) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.month; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "' data-year='";
  if (stack2 = helpers.year) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.year; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "' id='feed'>\n      <!-- / New content button -->\n      <div id='newcontent'>\n        <a href='#'><i class=\"icon-refresh\"></i> ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "new_content", options) : helperMissing.call(depth0, "t", "new_content", options)))
    + " (<span></span>)</a>\n      </div>\n      <!-- / Feed errors -->\n      ";
  stack2 = self.invokePartial(partials['error-alert'], 'error-alert', depth0, helpers, partials, data);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n      <!-- / Posts loop -->\n      ";
  stack2 = self.invokePartial(partials['feed-posts'], 'feed-posts', depth0, helpers, partials, data);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </div>\n    <!-- / Load more button, triggered by infinite scroller -->\n    <!-- / every few pages -->\n    <div id='load-more'>\n      <a href='#'>\n        ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "feed.load_more", options) : helperMissing.call(depth0, "t", "feed.load_more", options)))
    + "\n        <i class='icon-long-arrow-down'></i>\n      </a>\n    </div>\n  </div>\n  <div id='feed-panel-column'>\n    <!-- / Group panel -->\n    ";
  stack2 = self.invokePartial(partials['feed-panel'], 'feed-panel', depth0, helpers, partials, data);
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
  


  return "<li class='group-card group-create opened'>\n  <a class='group-card-title'>\n    Create group\n    <i class='icon-chevron-down'></i>\n  </a>\n  <div class='group-card-content'>\n    <form class='row' id='create_group' method='post'>\n      <div class='tight columns small-24 large-14'>\n        <input autocapitalize='off' autocomplete='off' autocorrect='off' name='name' placeholder='Enter a group name' spellcheck='false' type='text'>\n      </div>\n      <div class='tight columns small-24 large-10'>\n        <a class='btn btn-white' href='#' role='submit'>Create</a>\n      </div>\n    </form>\n  </div>\n</li>\n";
  });
templates['_groups-create_first'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<div class='create-first-group'>\n  <h2>Welcome to <b>Asocial</b>. <br/>Name your first group:</h2>\n  <div class='row'>\n    <div class='columns small-24 large-16 large-centered'>\n      <form id='create_first_group' method='post'>\n        <input autocapitalize='off' autocomplete='off' autocorrect='off' autofocus='' name='name' spellcheck='false' type='text'>\n        <input type='submit'>\n        <a href='#' role='submit'>\n          <span class='default'>Get started</span>\n          <span class='hover'><i class=\"icon-ok\"></i></span>\n        </a>\n      </form>\n    </div>\n  </div>\n</div>\n";
  });
templates['_groups-group'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <a class='delete-group btn btn-white hint--left' data-group-id='";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-hint='Delete' href='#'>\n      <i class='icon-remove'></i>\n    </a>\n    ";
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
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n";
  stack1 = helpers.each.call(depth0, depth0.invites, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\n<li class='group-card group-invite'>\n  <div class='group-banner'>\n    <a class='group-banner-link invite-link' data-invite-p='";
  if (stack1 = helpers['P']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0['P']; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-invite-question='";
  if (stack1 = helpers.question) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.question; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-invite-state='";
  if (stack1 = helpers.state) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.state; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-invite-token='";
  if (stack1 = helpers.token) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.token; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' href='#'>\n      <span class='cover'>\n        ";
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data};
  stack2 = ((stack1 = helpers.compare),stack1 ? stack1.call(depth0, depth0.state, 1, options) : helperMissing.call(depth0, "compare", depth0.state, 1, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n        ";
  options = {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data};
  stack2 = ((stack1 = helpers.compare),stack1 ? stack1.call(depth0, depth0.state, 2, options) : helperMissing.call(depth0, "compare", depth0.state, 2, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n      </span>\n      <img class='placeholder' src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'>\n    </a>\n  </div>\n  <div class='group-card-content'>\n    <p>\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data};
  stack2 = ((stack1 = helpers.compare),stack1 ? stack1.call(depth0, depth0.state, 1, options) : helperMissing.call(depth0, "compare", depth0.state, 1, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data};
  stack2 = ((stack1 = helpers.compare),stack1 ? stack1.call(depth0, depth0.state, 2, options) : helperMissing.call(depth0, "compare", depth0.state, 2, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </p>\n  </div>\n</li>\n";
  return buffer;
  }
function program3(depth0,data) {
  
  
  return " Accept invitation ";
  }

function program5(depth0,data) {
  
  
  return " Pending confirmation ";
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <b>";
  if (stack1 = helpers.inviter_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.inviter_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</b> has invited you to join the group <b>";
  if (stack1 = helpers.group_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.group_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</b>.\n      ";
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      You are awaiting <b>";
  if (stack1 = helpers.inviter_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.inviter_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</b>'s confirmation to the group <b>";
  if (stack1 = helpers.group_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.group_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</b>.\n      We'll notify you when you can join it.\n      ";
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

  buffer += "<div class='row' id='groups'>\n  <div class='small-24 large-16 large-centered columns'>\n    ";
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


  buffer += "<div class='row' id='auth'>\n  <div class='columns small-24 large-16 large-centered'>\n    <h1>Asocial</h1>\n    <h2>The encrypted social network.</h2>\n    <div class='row' id='auth-methods'>\n      <div class='columns small-24 large-12 large-centered'>\n        <form id='login-form' method='post'>\n          <!-- / Error message -->\n          <div class='hidden' id='error'>\n            <i class='icon-warning-sign'></i>\n            <span></span>\n          </div>\n          <div class='input-text-icon'>\n            <i class='icon-envelope'></i>\n            <input name='email' placeholder='Email' type='text'>\n          </div>\n          <div class='input-text-icon'>\n            <i class='icon-lock'></i>\n            <input name='password' placeholder='";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "login.password", options) : helperMissing.call(depth0, "t", "login.password", options)))
    + "' type='password'>\n          </div>\n          <label for='remember_me'>\n            <input id='remember_me' name='remember_me' type='checkbox'>\n            <span>Keep me logged in</span>\n          </label>\n          <input type='submit'>\n          <a class='btn btn-success' href='#' role='submit'>\n            Log in <i class=\"icon-spinner icon-spin\"></i>\n          </a>\n          <p class='switchmode'>\n            Need an account? <a href=\"/register\" data-hbs>Create one</a>.\n          </p>\n        </form>\n      </div>\n    </div>\n  </div>\n</div>\n";
  return buffer;
  });
templates['_modals-alert'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "\n  <a class='hint--left' data-hint='Close' href='#' role='close-modal'>\n    <i class='icon-remove-sign'></i>\n  </a>\n  ";
  }

  buffer += "<div class='modal-title'>\n  ";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n  ";
  stack1 = helpers['if'].call(depth0, depth0.closable, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n<div class='modal-content'>\n  ";
  if (stack1 = helpers.content) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.content; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n  <a class='modal-button' href='#' role='close-modal'>\n    ";
  if (stack1 = helpers.submit) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.submit; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n  </a>\n</div>\n";
  return buffer;
  });
templates['_modals-invite'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "Invite a user!\n";
  });
templates['_navbar'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<div id='navbar'>\n  <div class='row'>\n    <div class='small-24'>\n      <ul>\n        <li id='brand'>\n          <a data-hbs='' href='/'>\n            Asocial\n          </a>\n        </li>\n        <li>\n          <a class='btn hint--bottom' data-hint='Notifications' data-popover='notifications-container' href='#' id='notifications'>\n            <i class='icon-bell-alt'></i>\n          </a>\n          <div class='popover' id='notifications-container'>\n            <h3>Notifications</h3>\n            <div class='scrollable' id='notifications-content'></div>\n          </div>\n        </li>\n        <li id='group-selector'>\n          <ul><li class='title'>\n            <a data-hbs='' href='/'>Groups</a>\n          </li><li class='group'></li></ul>\n        </li>\n        <div class='pull-right'>\n          <div class='hide-for-small'>\n            <li>\n              <a class='btn hint--bottom' data-hbs='' data-hint='Settings' href='/settings'>\n                <i class='icon-cog'></i>\n              </a>\n            </li>\n            <li>\n              <a class='btn hint--bottom' data-hint='Log out' href='/logout'>\n                <i class='icon-signout'></i>\n              </a>\n            </li>\n          </div>\n          <div class='show-for-small'>\n            <li id='side-pane'>\n              <a class='btn' data-hbs='' href='#'>\n                <i class='icon-reorder'></i>\n              </a>\n            </li>\n          </div>\n        </div>\n      </ul>\n    </div>\n  </div>\n</div>\n";
  });
templates['_register'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "<div class='row' id='auth'>\n  <div class='columns small-24 large-16 large-centered'>\n    <h1>Asocial</h1>\n    <h2>The encrypted social network.</h2>\n    <div class='row' id='auth-methods'>\n      <div class='columns small-24 large-12 large-centered'>\n        <form id='register-form' method='post'>\n          <div class='hidden' id='error'>\n            <i class='icon-warning-sign'></i>\n            <span></span>\n          </div>\n          <div class='input-text-icon'>\n            <i class='icon-user'></i>\n            <input autocapitalize='off' autocomplete='off' autocorrect='off' name='full_name' placeholder='Full name' spellcheck='false' type='text'>\n          </div>\n          <div class='input-text-icon'>\n            <i class='icon-envelope'></i>\n            <input autocapitalize='off' autocomplete='off' autocorrect='off' name='email' placeholder='Email address' spellcheck='false' type='text'>\n          </div>\n          <div class='input-text-icon'>\n            <i class='icon-lock'></i>\n            <input name='password' placeholder='";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t']),stack1 ? stack1.call(depth0, "login.password", options) : helperMissing.call(depth0, "t", "login.password", options)))
    + "' type='password'>\n          </div>\n          <input type='submit'>\n          <a class='btn btn-success' href='#' role='submit'>\n            Register <i class=\"icon-spinner icon-spin\"></i>\n          </a>\n          <p class='switchmode'>\n            Already registered? <a href=\"/login\" data-hbs>Log in</a>.\n          </p>\n        </form>\n      </div>\n    </div>\n  </div>\n</div>\n";
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
templates['_video'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<video id=\"vid1\" autoplay></video>\n<video id=\"vid2\" autoplay></video>\n\n<div>\n  <button id=\"startButton\">Start</button>\n  <button id=\"callButton\">Call</button>\n  <button id=\"hangupButton\">Hang Up</button>\n</div>\n";
  });
})();