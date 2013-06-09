guard('asocial', {

  helpers: asocial_helpers,
  url: asocial_url,
  binders: asocial_binders,
  crypto: asocial_crypto,
  socket: asocial_socket,
  uploader: asocial_uploader,
  thumbnail: asocial_thumbnail,
  auth: asocial_auth,
  state: asocial_state,
  invite: asocial_invite

});

// Register all Handlebars templates.
$.each(Handlebars.templates, function (name, template) {
  Handlebars.registerPartial(name.slice(1), template);
});

// Execute global and route binders.
$(document).ready(function(){

  // Load current url and bind its binders
  asocial.binders.loadCurrentUrl();

});