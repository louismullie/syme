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

  bind: function(route, modules) {

    modules = modules || false;

    // Check function existence
    if(!$().binders[route]) return false;

    // Unbind everything
    this.unbind();

    if ( modules ) {

      // Execute specified functions
      _.each(modules, function(element){
        $().binders[route][element]();
      })

    } else {

      // Execute every binded function to route
      var obj = $().binders[route], key;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) obj[key]();
      }

    }

    // Start idleTimeout if logged in
    if(CurrentSession.initialized) this.idleTimeout();

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
      if (idleTime > 20) {
        clearInterval(idleInterval);
        asocial.auth.disconnect();
      }

    };

    var timerReset = function(){ idleTime = 0; };

    // Increment the idle time counter every minute.
    if ( typeof(idleInterval) === "undefined")
      idleInterval = setInterval(timerIncrement, 60 * 1000);

    // Zero the idle timer on mouse or keyboard activity.
    $(document).mousemove(timerReset).keydown(timerReset);

  }

});