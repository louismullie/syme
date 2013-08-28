guard('asocial', {
  
  version: '0.1.4',

  helpers:  asocial_helpers,
  binders:  asocial_binders,
  crypto:   asocial_crypto,
  socket:   asocial_socket

});

SERVER_URL = window.location.origin;

// Register all Handlebars templates.
$.each(Handlebars.templates, function (name, template) {
  Handlebars.registerPartial(name.slice(1), template);
});

$(function(){

  // Set the title for the document.
  if (Compatibility.inChromeExtension()) {
    document.title = "Syme";
  }

  // Bind a[hbs] to router
  $(document).on('click', 'a[hbs]', function(e){
    e.preventDefault();

    // Reset possible hidden tooltips
    $('a[data-popover]').removeClass('hint--hidden');

    // Hide popovers
    $('.popover').hide();

    Router.navigate( $(this).attr('href') );
  });

  // Initialize router
  Router = new Router;

  CurrentSession = new Session();

  CurrentSession.initialize(function () {

    Backbone.history.start({ pushState: true });

    // Bind global binders
    asocial.binders.bind('global', false);

    // Trigger root.
    if (Compatibility.inChromeExtension()) {
      Router.navigate('/');
    }

  }, function () { alert('Session failed!'); });

});