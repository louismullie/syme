asocial.binders.add('auth', { main: function(){

  // Registering mode
  $('#auth').on('submit', '#auth-form[data-registering]', function(e) {

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

  // Login mode
  $('#auth').on('submit', '#auth-form', function(e) {

    e.preventDefault();

    // Exit if form is in registering mode
    if( $(this).data('registering') ) return true;

    var form = $(this);

    var email    = form.find('input[name="email"]').val(),
        password = form.find('input[name="password"]').val(),
        remember = form.find('input[name="remember_me"]').prop("checked");

    // Does email exist in DB?
    asocial.auth.emailExists(email, function(){

      // Try to log in
      asocial.auth.login(email, password, remember, function() {

        // Authorize User
        asocial.auth.authorizeForUser(function () {

          // Load HBS template
          $('body').html( Fifty.render('container') );

          // Redirect to root, which is now group UI
          asocial.binders.loadCurrentUrl();

        }, password);

      }, function(reason) {

        if (reason == 'server') {
          alert('A server error has occured.');
        } else if (reason == 'credentials') {
          alert('Incorrect username or password.');
        } else if (reason == 'max_tries') {
          alert('Maximum login tries has been reached. ' +
          'Please wait at least 10 seconds and refresh the page.');
        }

      }); // asocial.auth.login()

    }, function(){

      // Switch form into registering mode
      form.attr('data-registering', true);

      // Show additional input
      form.find('input[name="full_name"]').focus();

      // Change submit button's title
      form.find('button').text('Register');

    }); // asocial.auth.emailExists()

  });

}});