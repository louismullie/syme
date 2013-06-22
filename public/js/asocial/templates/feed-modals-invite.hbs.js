
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['feed-modals-invite.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class='modal-title'>\n  Invite a user\n  <a class='hint--left' data-hint='Close' href='#' role='close-modal'>\n    <i class='icon-remove-sign'></i>\n  </a>\n</div>\n<div class='modal-content'>\n  <p class='header'>\n    Enter the email address of the person you want to invite\n    to your group below.\n  </p>\n  <p class='explanation'>\n    Your invitee will be asked to answer your group's\n    <span class=\"secret-question\" title=\"The real secret question\">secret question</span>\n    in order to join the group. If the answer is incorrect,\n    we will transmit the answer to you so that you can review\n    it manually.\n  </p>\n  <form action='post'>\n    <input name='email' placeholder='Enter an email' type='text'>\n    <a class='modal-button' href='#' role='submit'>\n      <span class='invite'>\n        Invite\n      </span>\n      <span class='spinner'>\n        <i class='icon-spinner icon-spin'></i>\n      </span>\n    </a>\n  </form>\n</div>\n";});
Handlebars.registerPartial('feed-modals-invite.hbs', Handlebars.templates['feed-modals-invite.hbs']);
