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

  bind: function(route, unbind, modules) {

    var unbind = unbind || true;
    var modules = modules || false;

    // Check function existence
    if(!$().binders[route]) return false;

    // Unbind everything
    if( unbind ) this.unbind();

    if ( modules ) {

      // Execute specified functions
      _.each(modules, function(element){
        // Check module existence
        if(!$().binders[route][element])
          throw 'No module' + element;

        // Call it
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

      if (Syme.Compatibility.inChromeExtension()) {

        chrome.storage.local.get('remember', function (setting) {
          
          // If the delay has not passed, or the user clicks
          // "remember me", no idle timeout is set on the session.
          if (idleTime < 20 || setting.remember) return;
          
          // Clear the timer interval.
          clearInterval(idleInterval);
          
          // Disconnect the user.
          Syme.Auth.disconnect();
          
        });

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