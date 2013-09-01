Syme.Binders.add('register', { main: function(){

  // Focus on first input[type="text"]
  $(document).find('input[type="text"]').first().focus();

  $("#register-form").ndbValidator({
    showErrors: function (input, errors) {

      // If the form hasn't been submitted yet, don't show errors
      // unless the concern input is [data-validate-persistent="true"]
      if (!input.closest('form').data('submit-failed') &&
          !input.data('validate-persistent')) return;

      // Message table
      var messages = {

        full_name: {
          required: "Please enter your name",
          minlength: "Your name is too short"
        },

        email: {
          required: "Please enter your email",
          email: "Your email looks weird"
        },

        password: {
          required: "Please enter a password",
          minlength: "Your password is too short",
          differs_from: "You should only use your password in one field",
          password_strength: "Your password isn't strong enough"
        },

        password_confirm: {
          equals_to: "Passwords don't match"
        }

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
  $('#auth').on('input', 'input[name="password"]', function () {

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

  // Registering mode
  $('#auth').on('submit', '#register-form', function(e) {
    
    var $this = $(this);
    
    if (Syme.Compatibility.inChromeExtension())
      chrome.storage.local.set({ 'hasRegistered':  true });
    
    e.preventDefault();
    
    // Lock event
    if( $this.data('active') ) {
      return false;
    } else {
      $this.data('active', true);
    };

    // Spinner
    $this.trigger('showSpinner', true);

    var email     = $this.find('input[name="email"]').val(),
        password  = $this.find('input[name="password"]').val(),
        fullName  = $this.find('input[name="full_name"]').val(),
        remember  = $this.find('input[name="remember_me"]').prop("checked");

    Syme.Auth.register(email, password, fullName, remember, function (error) {
      $('#auth').trigger('registrationError', error);
    });
    
  });

  // Registration error
  $('#auth').on('registrationError', function (e, error) {
    
    var $this = $(this);

    var errorMessage = Syme.Messages.error.registration[error];

    // Find the relevant field to edit given error type.
    var errorField = { 'email_taken': 'email' }[error];

    // Verify the message and field were properly found.
    if(!errorMessage || !errorField)
      throw "Missing message or field for error.";

    // Set container as closest .validation-container
    var $container = $this.find('input[name="' + errorField + '"]')
                          .closest('div.validation-container');
    
    // Get message box
    var $box, $message = $container.find('div.validation-message');
    
    // If box does not exist
    if ($message.length == 0) {
      // Create the box
      var $box = $('<div class="validation-message" />').appendTo($container);
    } else {
      // Add the relevat field
      var $box = $container.find('div.validation-message')
        .attr('data-related-input', errorField);
    }
    
    // Fill message in box
    $box.html( errorMessage );

    // Unlock event
    $this.data('submit-failed', true);
    $this.find('#register-form').data('active', false);
    
    // Release spinner
    $this.trigger('showSpinner', false);
    
    return null;

  });
  
  $('#auth').on('showSpinner', function (e, show) {
    
    var $this = $(this);
    
    var submitButton = $this.find('a[role="submit"]');
    
    if (show == true) submitButton.addClass('loading');
    if (show == false) submitButton.removeClass('loading');
    
    return null;
    
  });
  
}});