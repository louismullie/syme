asocial.binders.add('settings', { main: function(){

  // Hide spinner
  $('#spinner').hide();

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

  });

  // 'Change name' input watcher
  $('#change-name input').keyup(function(e){
    $('#change-name-button')[
      $(this).val().length >= 5 && $(this).val() != $(this).attr('placeholder')
        ? 'removeClass'
        : 'addClass'
    ]('disabled');
  });

  // 'Change email' form
  $('#change-email').submit(function(e){

    var $this = $(this),
        input = $this.find('input');

    var val = input.val(),
        placeholder = input.attr('placeholder');

    // If not an email or equal to placeholder, return
    if ( !$.ndbValidator.regexps.email.test(val) || val == placeholder)
      return false;

    // Lock form
    if(!!$this.data('active')) return false;
    $this.data('active', true);

    $('#change-email-button').addClass('active');

    var callback = function(email){
      // Reset form and button
      $this.data('active', false);
      $('#change-email-button').removeClass('active');
      
      // Swap placeholder for value
      if (email) {
        input.attr('placeholder', email)
        input.val('');
      }
      
    };

    CurrentSession.getUser().save(
      { email: val },
      { success: function(model, response, options){
          callback( model.get('email') )
        }, error: function (model, response) {
          asocial.helpers.showAlert('This e-mail is already taken.');
          model.set('email', input.attr('placeholder')); // ??
          callback();
      }}
    );

  });

  // 'Change name' input watcher
  $('#change-email input').keyup(function(e){
    var val = $(this).val();

    $('#change-email-button')[
      $.ndbValidator.regexps.email.test(val) && val != $(this).attr('placeholder')
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

    $.ajax(SERVER_URL + '/users/' + CurrentSession.getUserId(), {

      type: 'DELETE',

      success: function () {
        asocial.auth.disconnect();
      },

      error: function () {
        if (response.status == 404) {
          asocial.helpers.showAlert(
            'This user has already left the group.');
        } else {
          alert('Could not delete user.');
        }
    }});

  });

  // 'Delete' input watcher
  $('#delete-account input').keyup(function(e){
    $('#delete-account-button')[
      $(this).val() == "delete" ?
      'removeClass' : 'addClass'
    ]('disabled');
  });

  // Delete form

} }); // asocial.binders.add();