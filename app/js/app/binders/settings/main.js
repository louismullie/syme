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

  }).find('input').keyup(function(e){

    var isMinLength = $(this).val().length >= 5,
        isDifferent = $(this).val() != $(this).attr('placeholder');

    $('#change-name-button')[
      isMinLength && isDifferent ? 'removeClass' : 'addClass'
    ]('disabled');

  });

  $('form#change-password')

    // 1. Validator
    .ndbValidator({
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

    })

    // 2. Password strength indicator
    .on('input', 'input[name="new_password"]', function () {

      var val         = $(this).val(),
          isMinLength = val.length >= $(this).attr('minlength');

      // Add or remove hidden class
      $('#password-score')[ isMinLength ? 'removeClass' : 'addClass' ]('hidden');

      // Password strength
      var strength = zxcvbn(val).score;

      // Password strength indicators (5 indexes)
      var explanations = [ 'poor', 'weak', 'good', 'great', 'excellent' ];

      $('#password-score')
        // Style accordingly to strengh level
        .attr('data-strength', strength)
        // Fill in strength indicator
        .html(explanations[strength]);

    })

    // 3. Disable / enable submit
    .on('input', 'input', function() {

      var areMinLength = $('#change-password input[type="password"]')
        .map(function(){ return $(this).val().length > 0; });

      $('#change-password-button')[
        _.every(areMinLength) ? 'removeClass' : 'addClass'
      ]('disabled');

    })

    .on('focus', 'input[name="current_password"]', function(){
      $('#change-password .validation-container').removeClass('hidden');
    });

  // Change password submitting
  $('#settings').on('submit', '#change-password', function(e){

    var $this             = $(this),
        current_password  = $('input[name="current_password"]', $this).val(),
        new_password      = $('input[name="new_password"]', $this).val();

    // Lock form and show spinner
    if(!!$this.data('active')) return false; $this.data('active', true);
    $('#change-password-button').addClass('active');

    // Change password
    Syme.Auth.changePassword(current_password, new_password,

      // Succeeded authentication with current password
      function (user){

        // Show password changed message
        Alert.show( Syme.Locales.account.settings.messages.password_changed_explanation, {
          title: Syme.Locales.account.settings.messages.password_changed,
          onhide: function(){

            // Softly disconnect user
            Syme.Auth.disconnect();

          }
        });

      },

      // Failed authentication with current password
      function () {

        // Get the validation container for the current password field
        var $container = $('input[name="current_password"]', $this)
          .closest('div.validation-container');

        // Create or get validation message box
        var $box = $container.find('div.validation-message').length ?
          $container.find('div.validation-message') :
          $('<div class="validation-message" />').appendTo($container);

        // Fill message in box
        $box.html( Syme.Messages.error.settings.not_current_password );

        // Unlock form and hide spinner
        $this.data('active', false);
        $('#change-password-button').removeClass('active');

      }

    );

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

  }).find('input').keyup(function(e){
    $('#delete-account-button')[
      $(this).val() == "delete" ? 'removeClass' : 'addClass'
    ]('disabled');
  });

  // Delete form

} }); // Syme.Binders.add();