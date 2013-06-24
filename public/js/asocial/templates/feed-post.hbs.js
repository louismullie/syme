
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['feed-post.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials;
  var buffer = "", stack1, foundHelper, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  stack1 = depth0;
  stack1 = self.invokePartial(partials['feed-avatar.hbs'], 'feed-avatar.hbs', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  return buffer;}

function program3(depth0,data) {
  
  
  return "\n      <a class='btn btn-white post-delete hint--left' data-hint='Delete' href='#'>\n        <i class='icon-remove'></i>\n      </a>\n      ";}

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <div class='attachment'>\n        ";
  stack1 = depth0.attachment;
  stack1 = helpers['with'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(6, program6, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </div>\n      ";
  return buffer;}
function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  stack1 = depth0;
  stack1 = self.invokePartial(partials['feed-attachment.hbs'], 'feed-attachment.hbs', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  return buffer;}

function program8(depth0,data) {
  
  
  return "active";}

function program10(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n          <a class='like-count hint--top' data-hint='";
  foundHelper = helpers.liker_names;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.liker_names; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "' href='#'><span>";
  foundHelper = helpers.like_count;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.like_count; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "</span>\n          Likes</a>\n          ";
  return buffer;}

  buffer += "<div class='post' data-encrypted='";
  foundHelper = helpers.encrypted;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.encrypted; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "' id='";
  foundHelper = helpers.id;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "'>\n  <!-- / Avatar -->\n  ";
  stack1 = depth0.owner;
  stack1 = helpers['with'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  <div class='post-indent'>\n    <!-- / Post header -->\n    <div class='post-header'>\n      <!-- / Owner name -->\n      <p class='post-header-infos'>\n        ";
  stack1 = depth0.owner;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.name;
  stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
  buffer += escapeExpression(stack1) + "\n        <!-- / Post time -->\n        <a class='time' hbs='' href='/users/";
  foundHelper = helpers.current_user_id;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.current_user_id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "/groups/";
  foundHelper = helpers.current_group_id;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.current_group_id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "/posts/";
  foundHelper = helpers.id;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "'>\n          <time class='timeago' datetime='";
  foundHelper = helpers.created_at;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.created_at; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "'></time>\n        </a>\n      </p>\n      <!-- / Delete button -->\n      ";
  stack1 = depth0.deletable;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(3, program3, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n    <!-- / Post content -->\n    <div class='post-content'>\n      <!-- / Collapsable content -->\n      <div class='collapsable'>\n        <div class='encrypted_notice'>\n          <i>This post is encrypted.</i>\n        </div>\n        <div class='encrypted'>\n          {\"content\": ";
  foundHelper = helpers.content;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.content; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + ", \"key\": \"";
  foundHelper = helpers.key;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.key; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "\"}\n        </div>\n      </div>\n      <!-- / Attachment -->\n      ";
  stack1 = depth0.attachment;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(5, program5, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n    <!-- / Post footer -->\n    <div class='post-footer'>\n      <div class='row'>\n        <!-- / Actions -->\n        <div class='post-footer-actions columns small-12'>\n          <!-- / Like action -->\n          <a class='like-action ";
  stack1 = depth0.likeable;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.liked_by_user;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(8, program8, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "' href='#'><span class='default-text'>Like</span><span class='active-text'>Unlike</span></a>\n          &sdot;\n          <!-- / Comment action -->\n          <a class='comment-action' href='#'>\n            Comment\n          </a>\n        </div>\n        <!-- / Informations -->\n        <div class='post-footer-informations columns small-12'>\n          <!-- / Like count -->\n          ";
  stack1 = depth0.likeable;
  stack1 = helpers['with'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(10, program10, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          &sdot;\n          <!-- / Comment count -->\n          <span class='comment-count'>";
  foundHelper = helpers.comment_count;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.comment_count; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "</span>\n          Comments\n        </div>\n      </div>\n    </div>\n    <div class='post-comments'>\n      ";
  stack1 = depth0;
  stack1 = self.invokePartial(partials['feed-comments.hbs'], 'feed-comments.hbs', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n  </div>\n</div>\n";
  return buffer;});
Handlebars.registerPartial('feed-post.hbs', Handlebars.templates['feed-post.hbs']);
