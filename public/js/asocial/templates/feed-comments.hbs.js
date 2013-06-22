
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['feed-comments.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials;
  var buffer = "", stack1, foundHelper, self=this, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  stack1 = depth0;
  stack1 = self.invokePartial(partials['feed-comment.hbs'], 'feed-comment.hbs', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  return buffer;}

  buffer += "<div class='comments'>\n  <!-- / Show collapsed comments -->\n  <div class='show-more ";
  foundHelper = helpers.comments_collapsed;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.comments_collapsed; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "'>\n    <a href='#'>\n      <i class='icon-comment-alt'></i>\n      View <span>";
  foundHelper = helpers.comments_collapsed_count;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.comments_collapsed_count; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "</span> more comments\n    </a>\n  </div>\n  <!-- / Comments -->\n  ";
  stack1 = depth0.comments;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n<!-- / Comment box -->\n<div class='comment-form'>\n  <textarea class='autogrow' maxlength='1500' name='content' placeholder='";
  foundHelper = helpers['t'];
  stack1 = foundHelper ? foundHelper.call(depth0, "feed.comment_post", {hash:{}}) : helperMissing.call(depth0, "t", "feed.comment_post", {hash:{}});
  buffer += escapeExpression(stack1) + "'></textarea>\n</div>\n";
  return buffer;});
Handlebars.registerPartial('feed-comments.hbs', Handlebars.templates['feed-comments.hbs']);
