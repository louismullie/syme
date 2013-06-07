asocial.binders.add('register', { main: function(){

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
        var msg = JSON.parse(response.responseText);
        console.log(msg);
        alert('Registration error!');

        // Unlock event
        $(this).data('active', false);

        // Spinner
        $('a[role="submit"]').removeClass('loading');

      }}

    );

  });

}});