asocial.binders.add('register', { main: function(){

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
          email: "Your email seems weird"
        },

        password: {
          required: "Please enter a password",
          minlength: "Your password is too short",
          password_strength: "Your password isn't strong enough"
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
        // Otherwise, default
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
    var explanations = [ 'poor', 'okay', 'good', 'excellent', 'perfect' ];

    $('#password-score')
      // Style accordingly to strengh level
      .attr('data-strength', strength)
      // Fill in strength indicator
      .html(explanations[strength]);

  });

  // Registering mode
  $('#auth').on('submit', '#register-form', function(e) {

    e.preventDefault();

    // Lock event
    if($(this).data('active')) return false;
    $(this).data('active', true);

    // Spinner
    $('a[role="submit"]').addClass('loading');

    var form      = $(this);

    var email     = form.find('input[name="email"]').val(),
        password  = form.find('input[name="password"]').val(),
        fullName = form.find('input[name="full_name"]').val(),
        remember  = form.find('input[name="remember_me"]').prop("checked");

    var user = new User();
    var srp = new SRPClient(email, password);

    user.save(

      { email: email, full_name: fullName },

      { success: function (model, response) {

        var verifierSalt = srp.randomHexSalt();

        var verifierBn = srp.calculateV(verifierSalt);
        var verifierHex = verifierBn.toString(16);

        model.save({

          verifier: new Verifier({
            content: verifierHex,
            salt: verifierSalt
          })

          }, {

          success: function (model, response) {
          
            user.createKeyfile(password, function () {
              
              asocial.auth.login(email, password, remember, function() {
                
                CurrentSession = new Session(model);
                Router.navigate('', { trigger: true, replace: true });

              });

            });
          },

          error: function (model, response) {
            asocial.helpers.showAlert('Registration error.', { onhide: location.reload });
          }

        });

      },

      error: function (model, response) {

        // @Chris implement error handling here.
        var msg = JSON.parse(response.responseText);
        console.log(msg);

        asocial.helpers.showAlert('Registration error.', { onhide: function(){ window.location = '/'; } });

        // Unlock event
        $(this).data('active', false);

        // Spinner
        $('a[role="submit"]').removeClass('loading');

      }}

    );

  });

}});