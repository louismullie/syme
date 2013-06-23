guard('asocial', {

  helpers: asocial_helpers,
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

$(function(){

  // Initialize router
  Router = new Router;
  Backbone.history.start({ pushState: true });

  // Bind a[hbs] to router
  $(document).on('click', 'a[hbs]', function(e){
    e.preventDefault();
    Router.navigate( $(this).attr('href'), { trigger: true } );
  });

  // Bind global binders
  $().binders['global']['main']();

});