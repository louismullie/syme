
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['form.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials;
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  stack1 = depth0;
  stack1 = self.invokePartial(partials['feed-avatar'], 'feed-avatar', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  return buffer;}

  buffer += "<form id='feed-form' method='post'>\n  <a id='feed-form-avatar'>\n    <span>\n      <i class='icon-picture'></i>\n    </span>\n    ";
  stack1 = depth0.user;
  stack1 = helpers['with'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </a>\n  <input class='hidden' id='upload_avatar' name='account-picture' type='file'>\n  <!-- / Drag-and-drop helper -->\n  <div id='drag-helper'>\n    <p>Drag & Drop files here</p>\n  </div>\n  <!-- / Progress bar (hidden for now) -->\n  <div class='progress progress-striped active hidden'>\n    <div class='bar' id='progress_bar'></div>\n  </div>\n  <!-- / Textarea -->\n  <div id='textarea-holder'>\n    <textarea class='autogrow' maxlength='5000' name='content' placeholder=\"What's happening?\"></textarea>\n  </div>\n  <!-- / Hidden encryption-related inputs -->\n  <input id='encrypted_content' name='encrypted_content' type='hidden'>\n  <input id='mentioned_users' name='mentioned_users' type='hidden'>\n  <!-- / Hidden upload-related inputs -->\n  <input id='upload_id' name='upload_id' type='hidden'>\n  <input class='hidden' id='upload_file' type='file'>\n  <div id='upload-box'>\n    <div class='upload-row'>\n      <span class='icon'>\n        <i class='icon-spinner icon-spin'></i>\n      </span>\n      <span class='filename'></span>\n      <span class='filesize'></span>\n      <a class='delete-upload hint--left' data-hint='Remove' href='#'>\n        <i class='icon-remove'></i>\n      </a>\n    </div>\n  </div>\n  <div class='row collapse'>\n    <div class='columns small-24 large-20'>\n      <!-- / Attachment box -->\n      <ul id='attachments'>\n        <li class='title'>Attach:</li>\n        <li>\n          <a data-upload-trigger='photo' href='#'>\n            <i class='icon-camera'></i>\n            Photo\n          </a>\n        </li>\n        <li>\n          <a data-upload-trigger='video' href='#'>\n            <i class='icon-film'></i>\n            Video\n          </a>\n        </li>\n        <li>\n          <a data-upload-trigger='file' href='#'>\n            <i class='icon-file'></i>\n            File\n          </a>\n        </li>\n      </ul>\n    </div>\n    <div class='columns small-24 large-4'>\n      <a class='btn btn-success' href='#' role='submit'>Post</a>\n    </div>\n  </div>\n</form>\n";
  return buffer;});
