
Handlebars.templates = Handlebars.templates || {};
Handlebars.templates['create.hbs'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<li class='group-card group-create opened'>\n  <a class='group-card-title'>\n    Create group\n    <i class='icon-chevron-down'></i>\n  </a>\n  <div class='group-card-content'>\n    <form class='row' id='create_group' method='post'>\n      <div class='tight columns small-24 large-14'>\n        <input autocapitalize='off' autocomplete='off' autocorrect='off' name='name' placeholder='Enter a group name' spellcheck='false' type='text'>\n      </div>\n      <div class='tight columns small-24 large-10'>\n        <a class='btn btn-white' href='#' role='submit'>Create</a>\n      </div>\n    </form>\n  </div>\n</li>\n";});
