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

  // Make a[role="submit"] behave like <input type="submit">
  $(document).on('click', 'a[role="submit"]', function(e){
    $(this).closest('form').submit();
  });

  // Make forms sumbit on enter key (whether there's a submit button or not)
  // but omit enter key event on autocomplete dropdowns, when it's coupled
  // with shift, or when a textarea is in focus. To make a focused textarea
  // submit with enter key, add  a "data-single-line" attribute to its tag.
  // $(document).on('keydown', 'form', function(e) {
  //   // If key pressed is enter without shift
  //   if (e.which == 13 && !e.shiftKey) {
  //     e.preventDefault();
  //     e.stopPropagation();

  //     // If there's a multiline textarea in focus, do nothing.
  //     if ($('textarea').is(':focus') && !$('textarea:focus').hasData('single-line')) return false;

  //     // Submit form
  //     alert('Forcing form submitting');
  //     $(this).submit();
  //     alert('Form submitted');

  //     return false;
  //   }
  // });

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

  $('#notifications-container').on('click', '.notification-unread', function(e) {

    var id = $(this).closest('.notification').attr('id');

    $.ajax('/notifications/' + id, {

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
        alert('Clearing failed.');
      }

    });

  });

} }); // asocial.binders.add();