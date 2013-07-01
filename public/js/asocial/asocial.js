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

SERVER_URL = window.location.origin;

// Register all Handlebars templates.
$.each(Handlebars.templates, function (name, template) {
  Handlebars.registerPartial(name.slice(1), template);
});

$(function(){

  // Bind a[hbs] to router
  $(document).on('click', 'a[hbs]', function(e){
    e.preventDefault();

    Router.navigate( $(this).attr('href') );
  });

  // Bind global binders
  $().binders['global']['main']();

  // Initialize router
  Router = new Router;
  
  CurrentSession = new Session(null, function () {

    Backbone.history.start({ pushState: true });
    
    // Trigger root.
    if (asocial.compat.inChromeExtension()) {
      Router.navigate('/');
    }

  }, function () { alert('Session failed!'); });
  
});