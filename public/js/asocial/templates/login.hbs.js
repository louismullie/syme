
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['login.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "<div class='row' id='auth'>\n  <div class='columns small-24 large-16 large-centered'>\n    <h1>Asocial</h1>\n    <h2>The encrypted social network.</h2>\n    <div class='row' id='auth-methods'>\n      <div class='columns small-24 large-12 large-centered'>\n        <form id='login-form' method='post'>\n          <!-- / Error message -->\n          <div class='hidden' id='error'>\n            <i class='icon-warning-sign'></i>\n            <span></span>\n          </div>\n          <div class='input-text-icon'>\n            <i class='icon-envelope'></i>\n            <input name='email' placeholder='Email' type='text'>\n          </div>\n          <div class='input-text-icon'>\n            <i class='icon-lock'></i>\n            <input name='password' placeholder='";
  foundHelper = helpers['t'];
  stack1 = foundHelper ? foundHelper.call(depth0, "login.password", {hash:{}}) : helperMissing.call(depth0, "t", "login.password", {hash:{}});
  buffer += escapeExpression(stack1) + "' type='password'>\n          </div>\n          <label for='remember_me'>\n            <input id='remember_me' name='remember_me' type='checkbox'>\n            <span>Keep me logged in</span>\n          </label>\n          <input type='submit'>\n          <a class='btn btn-success' href='#' role='submit'>\n            Log in <i class=\"icon-spinner icon-spin\"></i>\n          </a>\n          <p class='switchmode'>\n            Need an account? <a href=\"/register\" data-hbs>Create one</a>.\n          </p>\n        </form>\n      </div>\n    </div>\n  </div>\n</div>\n";
  return buffer;});
Handlebars.registerPartial('login.hbs', Handlebars.templates['login.hbs']);
