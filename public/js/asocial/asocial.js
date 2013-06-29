guard('asocial', {

  helpers: asocial_helpers,
  binders: asocial_binders,
  crypto: asocial_crypto,
  socket: asocial_socket,
  uploader: asocial_uploader,
  auth: asocial_auth,
  state: asocial_state,
  error: asocial_error,
  invite: asocial_invite,
  compat: asocial_compat

});

// Register all Handlebars templates.
$.each(Handlebars.templates, function (name, template) {
  Handlebars.registerPartial(name.slice(1), template);
});

$(function(){

  // Initialize router
  Router = new Router;
  Backbone.history.start({ pushState: true });

  // Hardwire History.checkUrl() to Router.checkUrl()
  // Backbone.$(window).off('popstate').on('popstate', Router.checkUrl);

  // Bind a[hbs] to router
  $(document).on('click', 'a[hbs]', function(e){
    e.preventDefault();

    Router.navigate( $(this).attr('href') );
  });

  // Bind global binders
  $().binders['global']['main']();

  // Trigger root.
  if (asocial.compat.inChromeExtension()) {
    Router.navigate('/');
  }

});