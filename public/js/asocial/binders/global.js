asocial.binders.add('global', { main: function(){

  // Popovers
  $(document).on('click', 'a[data-popover]', function(e){
    e.stopPropagation();

    // Get container from attributes
    var container = $( '#' + $(this).data('popover') );

    // Toggle it
    container.is(':visible') ?
      container.hide() :
      container.fadeIn(100);
  });

  // Hide popovers on outside click
  $(document).on('click', function(e){
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

  // Implement session timeouts
  $(document).ready(function () {

    var idleTime = 0;

    function timerIncrement() {
      idleTime = idleTime + 1;
      if (idleTime > 20) { // 20 minutes
        window.location = '/logout';
      }
    }

    // Increment the idle time counter every minute.
    var idleInterval = setInterval(timerIncrement, 60000); // 1 minute

    // Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) { idleTime = 0; });

    $(this).keypress(function (e) { idleTime = 0; });

  });

  $('.notification-unread').click(function(e) {

    var id = $(this).closest('.notification').attr('id');

    $.ajax('/notifications/' + id, {

      type: 'delete',

      success: function () {
        // For now
        $('#' + id).remove();
      },

      error: function () {
        alert('Clearing failed.');
      }

    });

  });

} }); // asocial.binders.add();