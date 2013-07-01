asocial.binders.add('settings', { main: function(){

  // Breadcrumbs
  asocial.helpers.navbarBreadcrumbs({
    brand_only: true,

    elements: [
      { title: 'Settings',
        href: 'users/' + CurrentSession.getUserId() }
    ]
  });

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

    var callback = function(full_name){
      // Reset form and button
      $this.data('active', false);
      $('#change-name-button').removeClass('active');

      // Swap placeholder for value
      input
        .attr('placeholder', full_name)
        .val('');
    };

    CurrentSession.getUser().save(
      { full_name: val },
      { success: function(model, response, options){
        callback( model.attributes.full_name )
      } }
    );

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