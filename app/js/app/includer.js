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

    var href = $(this).attr('href');

    // Reset possible hidden tooltips
    $('a[data-popover]').removeClass('hint--hidden');
    $('.popover').hide();

    // Follow link
    Syme.Router.checkForUnsavedContent(function(){
      Syme.Router.navigate(href);
    });

  });

  // Initialize router
  Syme.Router = new Syme.Router();

  Syme.CurrentSession = new Syme.Session();
  Syme.FileManager = new Syme.FileManager();

  Syme.CurrentSession.initialize(function () {

    Syme.FileManager.initialize(function () {

      Syme.Router.startHistory();

      // Bind global binders
      Syme.Binders.bind('global', false);

      // Trigger root.
      if (Syme.Compatibility.inChromeExtension()) {
        Syme.Router.navigate('/');
      }

    });

  }, function () { alert('Session failed!'); });

  // Prevent leaving if there's unsaved content
  $(window).bind("beforeunload", function(e) {

    var unsavedContent = _.any($('textarea'),
      function (textarea) { return textarea.value != ''; });
    
    if (!unsavedContent) Syme.Cache.clear();

    return unsavedContent ? Syme.Messages.error.unsavedContent : null;

  });
  
});