asocial.binders.add('register', { main: function(){

  // Registering mode
  $('#auth').on('submit', '#register-form', function(e) {

    e.preventDefault();

    var form      = $(this);
    
    // Lock event
    if(form.data('active')) return false;
    form.data('active', true);
    
    form.find('#error').addClass('hidden').
      find('span').html('');

    // Spinner
    $('a[role="submit"]').addClass('loading');


    var email     = form.find('input[name="email"]').val(),
        password  = form.find('input[name="password"]').val(),
        fullName = form.find('input[name="full_name"]').val(),
        remember  = form.find('input[name="remember_me"]').prop("checked");

    var user = new User();
    var srp = new SRP(email, password);

    user.save(

      { email: email, full_name: fullName },

      { success: function (model, response) {

        var verifierSalt = response.verifier.salt;
        var verifier = srp.calcV(verifierSalt).toString();

        model.save({

          verifier: new Verifier({
            content: verifier,
            salt: verifierSalt
          })

          }, {

          success: function () {

            user.createKeypair(password, function () {

              asocial.auth.login(email, password, remember, function() {

                // Authorize User
                asocial.auth.authorizeForUser(function () {

                  // Load HBS template
                  $('body').html( Fifty.render('container') );

                  // Redirect to root, which is now group UI
                  asocial.binders.goToUrl('/');

                }, password);

              });

            });
          },

          error: function (model, response) {  alert('Registration error!'); }

        });

      },

      error: function (model, response) {

        // @Chris implement error handling here.
        var error = JSON.parse(response.responseText).error;

        var msg;
        
        if (error == 'email_taken') {
          msg = 'This e-mail is already taken.';
        } else if (error = 'missing_params') {
          msg = 'Please fill in all fields.';
        } else {
          msg = 'An unknown error has occured: ' + msg;
        }
        
        // Show error.
        form.find('#error').removeClass('hidden').
          find('span').html(msg);
        
        // Unlock event
        form.data('active', false);

        // Spinner
        $('a[role="submit"]').removeClass('loading');

      }}

    );

  });

}});