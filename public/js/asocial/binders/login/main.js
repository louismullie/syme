asocial.binders.add('login', { main: function(){

  // Login mode
  $('#auth').on('submit', '#login-form', function(e) {

    e.preventDefault();

    var form = $(this);

    // Lock event
    if(form.data('active')) return false;
    form.data('active', true);
    form.find('#error').removeClass('hidden').
      find('span').html('');

    // Spinner
    $('a[role="submit"]').addClass('loading');

    // Exit if form is in registering mode
    if( $(this).data('registering') ) return true;

    var email    = form.find('input[name="email"]').val(),
        password = form.find('input[name="password"]').val(),
        remember = form.find('input[name="remember_me"]').prop("checked");

      // Login
      asocial.auth.login(email, password, remember, function(data) {

        // Redirect to root
        Router.navigate('/users/' + data.user_id + '/groups',
          { trigger: true, replace: true });

      }, function(reason) {

        var msg;

        if (reason == 'server') {
          msg = 'A server error has occured.';
        } else if (reason == 'credentials') {
          msg = 'Incorrect username or password.';
        } else if (reason == 'max_tries') {
          msg = 'Maximum login tries has been reached. ' +
          'Please wait at least 10 seconds and refresh the page.';
        } else {
          msg = 'An unknown error has occured.';
        }

        form.find('#error').removeClass('hidden').
          find('span').html(msg);

        // Unlock event
        form.data('active', false);

        // Spinner
        $('a[role="submit"]').removeClass('loading');

      });

  });

}});