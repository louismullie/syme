guard('binders', {

  // Maybe should not use $.fn.binders
  // Use a local variable here instead.
  add: function(route, objectExtention) {
    // Create namespace for binders.
    if(typeof($.fn.binders) === 'undefined')
      $.fn.binders = {};
    // Create route object if it doesn't exist
    if(typeof($.fn.binders[route]) === 'undefined')
      $.fn.binders[route] = {};

    // Append the new binder
    $.extend($.fn.binders[route], objectExtention);
  },

  bind: function(route) {

    // Check function existence
    if(!$().binders[route]) return false;

    // Unbind everything
    this.unbind();

    // Execute every binded function to route
    var obj = $().binders[route], key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) obj[key]();
    }

    // Start idleTimeout if logged in
    if(asocial.state.system.logged_in) this.idleTimeout();

  },

  unbind: function() {

    // Unbind page events
    $('#main').off();

    // Unlock potential socket locking
    $(window).data('lockSocketUpdating', false);

    // Deactivate infinite scrolling
    $(window).off('scroll');
  },

  idleTimeout: function(){

    idleTime = 0;

    var timerIncrement = function() {
      idleTime++;

      // After x minutes
      if (idleTime > 5) {
        // Clear interval
        clearInterval(idleInterval);

        // Log out
        $.ajax('http://localhost:5000/sessions/xyz', { type: 'delete'} );

        // Disconnection alert box
        asocial.helpers.showAlert('You have been disconnected', {
          title: 'Disconnected',
          submit: 'Log in',
          closable: false,
          onhide: function(){
            window.location = '/login';
          }
        });
      }
    };

    var timerReset = function(){ idleTime = 0; };

    // Increment the idle time counter every minute.
    idleInterval = setInterval(timerIncrement, 60 * 1000);

    // Zero the idle timer on mouse or keyboard activity.
    $(document).mousemove(timerReset).keydown(timerReset);

  }

});