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

          success: function () {

            user.createKeypair(password, function () {

              asocial.auth.login(email, password, remember, function() {

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

        asocial.helpers.showAlert('Registration error.', { onhide: location.reload });

        // Unlock event
        $(this).data('active', false);

        // Spinner
        $('a[role="submit"]').removeClass('loading');

      }}

    );

  });

}});