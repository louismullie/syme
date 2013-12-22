Syme.Binders.add('settings', { main: function(){

  // Hide spinner
  NProgress.done();

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

    Syme.CurrentSession.getUser().save(
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

  // 'Change password' validator
  $('#change-password').ndbValidator({
    showErrors: function (input, errors) {

      // If the form hasn't been submitted yet, don't show errors
      // unless the concerned input is [data-validate-persistent="true"]
      if (!input.closest('form').data('submit-failed') &&
          !input.data('validate-persistent')) return;

      // Message table
      var messages = {

        new_password: {
          minlength:          "Your password is too short",
          password_strength:  "Your password isn't strong enough"
        },

        new_password_confirm: {
          equals_to: "Passwords don't match"
        },

      };

      var name = input.attr('name');

      // Set container as closest .validation-container
      var container = input.closest('div.validation-container');

      // Get message box
      var box = container.find('div.validation-message').length == 0
        // If message box doesn't exist, create it
        ? $('<div class="validation-message" />').appendTo(container)
        // If it exists, select it
        : container.find('div.validation-message');

      // Get the first error message of element
      var message = typeof messages[name] !== "undefined" ||
        typeof messages[name][errors[0]] !== "undefined"
        // If message exists
        ? messages[name][errors[0]]
        // Otherwise, missing message error
        : 'Missing message for ' + errors[0];

      box
        // Identify message box with related input name
        .attr('data-related-input', name)
        // Fill message box
        .html( message );

    },

    hideErrors: function (input) {
      // Remove message box
      $('div.validation-message[data-related-input="' + input.attr('name') + '"]').remove();
    }
  });

  // Password strength indicator
  $('#change-password').on('input', 'input[name="new_password"]', function () {

    // Get password value
    var val = $(this).val();

    var isMinLength = val.length >= $(this).attr('minlength');

    // Add or remove hidden class
    $('#password-score')[ isMinLength ? 'removeClass' : 'addClass' ]('hidden');

    // Password strength
    var strength = zxcvbn(val).score;

    // Password strength indicators (5 indexes)
    var explanations = [ 'poor', 'weak', 'good', 'great', 'perfect' ];

    $('#password-score')
      // Style accordingly to strengh level
      .attr('data-strength', strength)
      // Fill in strength indicator
      .html(explanations[strength]);

  });

  // 'Change email' form
  //$('#change-email').submit(function(e){

  //  var $this = $(this),
  //      input = $this.find('input');

  //  var val = input.val(),
  //      placeholder = input.attr('placeholder');

  //  // If not an email or equal to placeholder, return
  //  if ( !$.ndbValidator.regexps.email.test(val) || val == placeholder)
  //    return false;

  //  // Lock form
  //  if(!!$this.data('active')) return false;
  //  $this.data('active', true);

  //  $('#change-email-button').addClass('active');

  //  var callback = function(email){
  //    // Reset form and button
  //    $this.data('active', false);
  //    $('#change-email-button').removeClass('active');
  //
  //    // Swap placeholder for value
  //    if (email) {
  //      input.attr('placeholder', email)
  //      input.val('');
  //    }
  //
  //  };

  //  Syme.CurrentSession.getUser().save(
  //    { email: val },
  //    { success: function(model, response, options){
  //        callback( model.get('email') )
  //      }, error: function (model, response) {
  //        Alert.show('This e-mail is already taken.');
  //        model.set('email', input.attr('placeholder')); // ??
  //        callback();
  //    }}
  //  );

  //});

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

    var deleteUserUrl = Syme.Url.fromCurrentUser();

    $.encryptedAjax(deleteUserUrl, {

      type: 'DELETE',

      // Callback when account deletion succeeded.
      success: function () {
        Syme.Auth.disconnect();
      },

      // Callback when account deletion succeeded.
      error: function (response) {
        Syme.Error.ajaxError(response, 'delete', 'group member');
      }

    });

  });

  // 'Delete' input watcher
  $('#delete-account input').keyup(function(e){
    $('#delete-account-button')[
      $(this).val() == "delete" ?
      'removeClass' : 'addClass'
    ]('disabled');
  });

  // Delete form

} }); // Syme.Binders.add();