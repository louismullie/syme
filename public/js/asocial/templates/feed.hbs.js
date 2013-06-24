
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['feed.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials;
  var buffer = "", stack1, foundHelper, self=this, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "<div class='row'>\n  <div id='feed-column'>\n    <!-- / Feed form -->\n    ";
  stack1 = depth0;
  stack1 = self.invokePartial(partials['feed-form.hbs'], 'feed-form.hbs', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    <!-- / Feed -->\n    <div data-group-name='";
  stack1 = depth0.group;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.name;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "' data-month='";
  foundHelper = helpers.month;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.month; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "' data-year='";
  foundHelper = helpers.year;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.year; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "' id='feed'>\n      <!-- / New content button -->\n      <div id='newcontent'>\n        <a href='#'><i class=\"icon-refresh\"></i> ";
  foundHelper = helpers['t'];
  stack1 = foundHelper ? foundHelper.call(depth0, "new_content", {hash:{}}) : helperMissing.call(depth0, "t", "new_content", {hash:{}});
  buffer += escapeExpression(stack1) + " (<span></span>)</a>\n      </div>\n      <!-- / Feed errors -->\n      ";
  stack1 = depth0;
  stack1 = self.invokePartial(partials['error-alert.hbs'], 'error-alert.hbs', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      <!-- / Posts loop -->\n      ";
  stack1 = depth0;
  stack1 = self.invokePartial(partials['feed-posts.hbs'], 'feed-posts.hbs', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n    <!-- / Load more button, triggered by infinite scroller -->\n    <!-- / every few pages -->\n    <div id='load-more'>\n      <a href='#'>\n        ";
  foundHelper = helpers['t'];
  stack1 = foundHelper ? foundHelper.call(depth0, "feed.load_more", {hash:{}}) : helperMissing.call(depth0, "t", "feed.load_more", {hash:{}});
  buffer += escapeExpression(stack1) + "\n        <i class='icon-long-arrow-down'></i>\n      </a>\n    </div>\n  </div>\n  <div id='feed-panel-column'>\n    <!-- / Group panel -->\n    ";
  stack1 = depth0;
  stack1 = self.invokePartial(partials['feed-panel.hbs'], 'feed-panel.hbs', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </div>\n</div>\n";
  return buffer;});
Handlebars.registerPartial('feed.hbs', Handlebars.templates['feed.hbs']);
