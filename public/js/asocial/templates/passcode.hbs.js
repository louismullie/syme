
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['passcode.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class='custom-modal container-fluid' id='passphrase-modal'>\n  <div class='row-fluid'>\n    <div class='passphrase-modal-inner custom-modal-inner span8 offset2'>\n      <i class='icon-lock huge-icon'></i>\n      <p class='lead'>Please enter your secret passcode:</p>\n      <div class='control-group'>\n        <input id='passphrase' type='password'>\n      </div>\n      <p>\n        <a class='btn' id='passphrase-submit'>Decrypt my content</a>\n      </p>\n    </div>\n  </div>\n</div>\n";});
Handlebars.registerPartial('passcode.hbs', Handlebars.templates['passcode.hbs']);
