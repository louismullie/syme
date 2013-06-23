
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['register.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "<div class='row' id='auth'>\n  <div class='columns small-24 large-16 large-centered'>\n    <h1>Asocial</h1>\n    <h2>The encrypted social network.</h2>\n    <div class='row' id='auth-methods'>\n      <div class='columns small-24 large-12 large-centered'>\n        <form id='register-form' method='post'>\n          <div class='hidden' id='error'>\n            <i class='icon-warning-sign'></i>\n            <span></span>\n          </div>\n          <div class='input-text-icon'>\n            <i class='icon-user'></i>\n            <input autocapitalize='off' autocomplete='off' autocorrect='off' name='full_name' placeholder='Full name' spellcheck='false' type='text'>\n          </div>\n          <div class='input-text-icon'>\n            <i class='icon-envelope'></i>\n            <input autocapitalize='off' autocomplete='off' autocorrect='off' name='email' placeholder='Email address' spellcheck='false' type='text'>\n          </div>\n          <div class='input-text-icon'>\n            <i class='icon-lock'></i>\n            <input name='password' placeholder='";
  foundHelper = helpers['t'];
  stack1 = foundHelper ? foundHelper.call(depth0, "login.password", {hash:{}}) : helperMissing.call(depth0, "t", "login.password", {hash:{}});
  buffer += escapeExpression(stack1) + "' type='password'>\n          </div>\n          <input type='submit'>\n          <a class='btn btn-success' href='#' role='submit'>\n            Register <i class=\"icon-spinner icon-spin\"></i>\n          </a>\n          <p class='switchmode'>\n            Already registered? <a href=\"/login\" hbs>Log in</a>.\n          </p>\n        </form>\n      </div>\n    </div>\n  </div>\n</div>\n";
  return buffer;});
Handlebars.registerPartial('register.hbs', Handlebars.templates['register.hbs']);
