//= require ./headers
//= require_tree ./config
//= require_tree ./models
//= require_tree ./utilities
//= require_tree ./binders

$(function(){

  // Set the title for the document.
  if (Syme.Compatibility.inChromeExtension()) {
    setTimeout(function () { document.title = "Syme" }, 200);
  }

  // Bind a[hbs] to router
  $(document).on('click', 'a[hbs]', function(e){
    e.preventDefault();

    // Reset possible hidden tooltips
    $('a[data-popover]').removeClass('hint--hidden');

    // Hide popovers
    $('.popover').hide();

    // Follow link
    Syme.Router.navigate( $(this).attr('href') );

  });

  // Initialize router
  Syme.Router = new Syme.Router();

  Syme.CurrentSession = new Syme.Session();
  Syme.FileManager = new Syme.FileManager();

  Syme.CurrentSession.initialize(function () {

    Syme.FileManager.initialize(function () {

      Backbone.history.start({ pushState: true });

      // Bind global binders
      Syme.Binders.bind('global', false);

      // Trigger root.
      if (Syme.Compatibility.inChromeExtension()) {
        Syme.Router.navigate('/');
      }

    });

  }, function () { alert('Session failed!'); });

});