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

  },

  unbind: function() {

    // Unbind page events
    $('#main').off();

    // Unlock potential socket locking
    $(window).data('lockSocketUpdating', false);

    // Deactivate infinite scrolling
    $(window).off('scroll');
  }

});