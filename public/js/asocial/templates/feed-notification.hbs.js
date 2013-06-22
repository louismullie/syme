
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['feed-notification.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class='notification' id='";
  foundHelper = helpers.id;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "'>\n  <p class='notification-content'>\n    <a class='notification-unread' href='#' title=''>\n      <i class='icon-circle'></i>\n    </a>\n    ";
  foundHelper = helpers.html;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.html; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </p>\n  <p class='notification-infos'>\n    ";
  foundHelper = helpers.created_at;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.created_at; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1) + "\n  </p>\n</div>\n";
  return buffer;});
Handlebars.registerPartial('feed-notification.hbs', Handlebars.templates['feed-notification.hbs']);
