Binders.add('global', { main: function(){

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

    var userId = CurrentSession.getUserId();
    var url = SERVER_URL + '/users/' + userId + '/notifications';

    $.encryptedAjax(url, {

      type: 'DELETE',

      success: function () {
        Notifications.reset();
        Notifications.fetch();
      },

      error: function () {
        alert('Could not clear notifications.');
      }

    });

  });

  // Background image decryption
  $(document).on('decrypt', '.encrypted-background-image', function(e, done){

    var $this = $(this),
        done  = done || function(){};

    var image_id  = $this.attr('data-attachment-id'),
        keys      = $this.attr('data-attachment-keys'),
        group_id  = $this.attr('data-attachment-group');

    if ( !keys ) return done();

    var callback = function(url) {

      if (!url) return done();

      $this.css("background-image", "url('" + url + "')");

      // Set as decrypted
      $this.attr('data-decrypted', true);

      done();
    }

    // Decrypt and place background-image
    FileManager.getFile(image_id, keys, callback, group_id);

  });

} }); // Binders.add();