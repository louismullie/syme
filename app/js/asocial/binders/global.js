asocial.binders.add('global', { main: function(){

  // Set the title for the document.
  if (asocial.compat.inChromeExtension()) {
    document.title = "Syme";
    window.history.replaceState('Object', 'Title', '/');
  }

  // Popovers
  $(document).on('click', 'a[data-popover]', function(e){
    e.stopPropagation();

    // Get container from attributes
    var container = $( '#' + $(this).data('popover') );

    // Toggle it
    if ( container.is(':visible') ) {

      // Reset possible hidden tooltips
      $(this).removeClass('hint--hidden');

      // Hide popover
      container.hide();

    } else {

      // Hide possible tooltips
      $(this).addClass('hint--hidden');

      // Hide possible popovers
      $('.popover').hide();

      // Show popover
      container.fadeIn(100);

    }

  });

  // Hide popovers on outside click
  $(document).on('click', function(e){
    // Reset possible hidden tooltips
    $('a[data-popover]').removeClass('hint--hidden');

    // Hide popover
    $('.popover').hide();
  });

  // Prevent closing of popover when clicking on them (opened)
  $(document).on('click', '.popover', function(e){
    e.stopPropagation();
  });

  // Prevent anchor links from scrolling to top
  $(document).on('click', 'a[href="#"]', function(e){
    e.preventDefault();
  });

  // Prevent all forms from submitting
  $(document).on('submit', 'form', function(e){
    e.preventDefault();
  });

  // Make a[role="submit"] behave like <input type="submit">
  $(document).on('click', 'a[role="submit"]', function(e){
    if( !$(this).hasClass('disabled') )
      $(this).closest('form').submit();
  });
  
  $(document).on('click', '.clear-notifications', function (e) {
    
    var url = SERVER_URL + '/users/' + CurrentSession.getUserId() + '/notifications';
    
    $.ajax(url, { type: 'DELETE',
      success: function () { Notifications.reset(); Notifications.fetch(); },
      error: function () { alert('Could not create notifications.'); }
    });
    
  });

} }); // asocial.binders.add();