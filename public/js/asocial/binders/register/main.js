asocial.binders.add('register', { main: function(){

  // Registering mode
  $('#auth').on('submit', '#register-form', function(e) {

    e.preventDefault();

    var form      = $(this);

    var email     = form.find('input[name="email"]').val(),
        password  = form.find('input[name="password"]').val(),
        full_name = form.find('input[name="full_name"]').val(),
        remember  = form.find('input[name="remember_me"]').prop("checked");

    // Register user
    asocial.auth.register(email, password, full_name, function (data) {

      asocial.auth.login(email, password, false, function (data) {

        asocial.auth.keygen(data.user_id, password, function () {
          asocial.binders.loadCurrentUrl();
        });

      }, function (reason) {
        alert(reason);
      });

    }, function(reason) {

      if (reason == 'email_taken') {
        alert('This email is already taken.');
      } else {
        alert('Unknown error: ' + reason);
      }

    });

  });

}});