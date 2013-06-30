asocial.binders.add('settings', { main: function(){

  // Navbar group selector
  var navbar_breadcrumbs = $('#group-selector');

  // Set title
  navbar_breadcrumbs.find('li.title a')
    .attr('href', '/users/' + asocial.state.user.id)
    .html('Settings')

  navbar_breadcrumbs.find('li.group').remove();

  // 'Change name' form
  $('#change-name').submit(function(e){

    var $this = $(this),
        input = $this.find('input');

    var val = input.val(),
        placeholder = input.attr('placeholder');

    // If input watcher < 5 or equal to placeholder, return
    if ( val.length < 5 || val == placeholder)
      return false;

    // Lock form
    if(!!$this.data('active')) return false;
    $this.data('active', true);

    $('#change-name-button').addClass('active');

    var callback = function(){
      // Reset form and button
      $this.data('active', false);
      $('#change-name-button').removeClass('active');

      // Swap placeholder for value
      input
        .attr('placeholder', 'New name return by ajax')
        .val('');
    };

    // Replace this by AJAX call
    setTimeout(callback, 1 * 1000);

  });

  // 'Change name' input watcher
  $('#change-name input').keyup(function(e){
    $('#change-name-button')[
      $(this).val().length >= 5 && $(this).val() != $(this).attr('placeholder')
        ? 'removeClass'
        : 'addClass'
    ]('disabled');
  });

  // 'Delete account' form
  $('#delete-account').submit(function(e){
    // If input watcher != "delete", return.
    if ( $(this).find('input').val() != "delete")
      return false;

    // Lock form
    if(!!$(this).data('active')) return false;
    $(this).data('active', true);

    // Place AJAX call to deletion here

    // Disconnect
    asocial.auth.disconnect();

  });

  // 'Delete' input watcher
  $('#delete-account input').keyup(function(e){
    $('#delete-account-button')[
      $(this).val() == "delete" ? 'removeClass' : 'addClass'
    ]('disabled');
  });

  // Delete form

} }); // asocial.binders.add();