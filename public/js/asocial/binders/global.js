asocial.binders.add('global', { main: function(){
  
  // Hide popovers on outside click
  $(document).off('click').on('click', function(e){
    $('.flat-popover').hide();
  });
  
  // Prevent anchor links from scrolling to top
  $(document).off('click', 'a[href="#"]').on('click', 'a[href="#"]', function(e){
    e.preventDefault();
  });

  $(document).off('click', '.flat-popover').on('click', '.flat-popover', function(e){
    e.stopPropagation();
  });

  // Close dropdown menu on route load
  $(document).off('click', 'ul.dropdown-menu a').on('click', 'ul.dropdown-menu a', function(e){
    $(this).closest('li.open').find('a.dropdown-toggle').dropdown('toggle');
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
  
  // Notifications popover
  $(document).off('click', '#notifications-button').on('click', '#notifications-button', function(e){
    e.stopPropagation();

    var container = $('#notifications-container');

    container.is(':visible') ?
      container.hide() :
      container.slideDown(100) ;
  });
  
  $('.clear-notification').click(function (e) {
    var id = $(this).closest('.notification').attr('id');
    
    $.ajax('/notifications/' + id, {
      
      type: 'delete', 
      
      success: function () {
        $(id).remove();
      }, 
      
      error: function () {
        alert('Clearing failed.');
      }
      
    });
    
  });
  
} }); // asocial.binders.add();