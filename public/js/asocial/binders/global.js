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

  // Implement session timeouts
  $(document).ready(function () {

    var idleTime = 0;

    function timerIncrement() {
      idleTime = idleTime + 1;
      if (idleTime > 20) { // 20 minutes

        // Log out
        $.ajax('http://localhost:5000/sessions/xyz', { type: 'delete'} );

        // Force disconnection
        asocial.helpers.showAlert('You have been disconnected', {
          title: 'Disconnected',
          submit: 'Log in',
          closable: false,
          onhide: function(){
            Router.nagivate('login', true);
          }
        });

      }
    }

    // Increment the idle time counter every minute.
    var idleInterval = setInterval(timerIncrement, 60000); // 1 minute

    // Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) { idleTime = 0; });

    $(this).keypress(function (e) { idleTime = 0; });

  });

  $(document).on('click', '#notifications-container a.notification-unread', function(e) {

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

  });
  
  $(document).on('click', '#logout', function (e) {
    asocial.auth.logout();
  });

} }); // asocial.binders.add();