asocial.binders.add('login', { main: function(){

  // Login mode
  $('#auth').on('submit', '#login-form', function(e) {

    e.preventDefault();

    // Lock event
    if($(this).data('active')) return false;
    $(this).data('active', true);

    // Spinner
    $('a[role="submit"]').addClass('loading');

    // Exit if form is in registering mode
    if( $(this).data('registering') ) return true;

    var form = $(this);

    var email    = form.find('input[name="email"]').val(),
        password = form.find('input[name="password"]').val(),
        remember = form.find('input[name="remember_me"]').prop("checked");

       // Try to log in
      asocial.auth.login(email, password, remember, function() {

        // Authorize User
        asocial.auth.authorizeForUser(function () {

          // Load HBS template
          $('body').html( Fifty.render('container') );

          // Redirect to root, which is now group UI
          asocial.binders.goToUrl('/');

        }, password);

      }, function(reason) {

        // Chris - move this to Handlebars template.
        if (reason == 'server') {
          alert('A server error has occured.');
        } else if (reason == 'credentials') {
          alert('Incorrect username or password.');
        } else if (reason == 'max_tries') {
          alert('Maximum login tries has been reached. ' +
          'Please wait at least 10 seconds and refresh the page.');
        }

        // Unlock event
        $(this).data('active', false);

        // Spinner
        $('a[role="submit"]').removeClass('loading');

      });

  });

}});