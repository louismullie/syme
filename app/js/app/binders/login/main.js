Syme.Binders.add('login', { main: function(){

  // Focus on first input[type="text"]
  $(document).find('input[type="text"]').first().focus();

  // Login mode
  $('#auth').on('submit', '#login-form', function(e) {

    e.preventDefault();

    var $this = $(this);

    // Lock event
    if(!!$this.data('active')) return false;
    $this.data('active', true);

    // Spinner
    $('a[role="submit"]').addClass('loading');

    var email    = $this.find('input[name="email"]').val(),
        password = $this.find('input[name="password"]').val(),
        remember = $this.find('input[name="remember_me"]').prop("checked");

      // Login
      Syme.Auth.login(email, password, remember, function(derivedKey, csrfToken, sessionKey) {

        Syme.CurrentSession = new Syme.Session(csrfToken);
        
        Syme.CurrentSession.initializeWithPasswordAndKey(
          derivedKey, sessionKey, remember, function () {
            Syme.Router.navigate('/users/' + Syme.CurrentSession.getUserId() +
            '/groups', { trigger: true, replace: true });
        });

      }, function(reason) {

        var msg;

        if (reason == 'server') {
          msg = 'A server error has occured.';
        } else if (reason == 'credentials') {
          msg = 'Incorrect username or password.';
        } else if (reason == 'max_tries') {
          msg = 'Maximum login tries has been reached. ' +
          'Please wait at least 10 seconds and refresh the page.';
        } else if (reason == 'throttle') {
          msg = 'Please slow down. Your IP has been logged.';
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