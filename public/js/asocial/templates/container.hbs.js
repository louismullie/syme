
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['container.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials;
  var buffer = "", stack1, self=this;


  buffer += "<div id='spinner'>\n  <i class='icon-spinner icon-spin'></i>\n</div>\n";
  stack1 = depth0;
  stack1 = self.invokePartial(partials['navbar.hbs'], 'navbar.hbs', stack1, helpers, partials);;
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n<div id='main'></div>\n<div id='footer'>\n  <div id='modals'></div>\n  <div id='canvases'>\n    <canvas id='canvas'></canvas>\n  </div>\n</div>\n";
  return buffer;});
Handlebars.registerPartial('container.hbs', Handlebars.templates['container.hbs']);
