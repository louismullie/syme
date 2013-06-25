asocial.binders.add('global', { main: function(){

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

  // Make a[role="submit"] behave like <input type="submit">
  $(document).on('click', 'a[role="submit"]', function(e){
    $(this).closest('form').submit();
  });

  $(document).on('click', '.notification-content a', function(e) {

    var id = $(this).closest('.notification').attr('id');

    $.ajax('http://localhost:5000/notifications/' + id, {

      type: 'delete',

      success: function () {

        // For now
        $('#' + id).remove();

        var count = parseInt($('.notification-badge').html()) - 1;

        if (count == 0) {
          $('.notification-badge').remove();
        } else {
          $('.notification-badge').html(count);
        }

      },

      error: function () {
        asocial.helpers.showAlert('Notification clearing failed', {
          onhide: function(){ location.reload(); }
        });
      }

    });

    // If click isn't the delete badge, kill tooltip
    if ( $(this).attr('href') != '#' ) {
      // Reset possible hidden tooltips
      $('a[data-popover]').removeClass('hint--hidden');

      // Hide popover
      $('.popover').hide();
    }

  });

} }); // asocial.binders.add();