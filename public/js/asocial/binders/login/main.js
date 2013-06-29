asocial.binders.add('login', { main: function(){

  // Login mode
  $('#auth').on('submit', '#login-form', function(e) {

    e.preventDefault();

    var $this = $(this);

    // Lock event
    if(!!$this.data('active')) { return false; } else { $this.data('active', true); }

    // Spinner
    $('a[role="submit"]').addClass('loading');

    // Exit if form is in registering mode
    if( $(this).data('registering') ) return true;

    var email    = $this.find('input[name="email"]').val(),
        password = $this.find('input[name="password"]').val(),
        remember = $this.find('input[name="remember_me"]').prop("checked");

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

        $this.find('#error').removeClass('hidden').
          find('span').html(msg);

        // Unlock event
        $this.data('active', false);

        // Spinner
        $('a[role="submit"]').removeClass('loading');

      });

  });

}});