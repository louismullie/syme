
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['layout.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<!DOCTYPE html>\n<html lang='en'>\n  <head>\n    <title>Asocial</title>\n    <!--[if lt IE 9]>\n    <script src=\"http://html5shim.googlecode.com/svn/trunk/html5.js\"></script>\n    <![endif]-->\n    <meta content='width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport'>\n    <meta content='The encrypted social network for groups.' name='description'>\n    <!-- /%meta{name: '_csrf', content: csrf_token } -->\n    <link href='/img/favicon.ico' rel='icon'>\n    <link href='/assets/asocial.css' rel='stylesheet' type='text/css'>\n    <script src='/assets/asocial.js'></script>\n  </head>\n  <body></body>\n</html>\n";});
Handlebars.registerPartial('layout.hbs', Handlebars.templates['layout.hbs']);
