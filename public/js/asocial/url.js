guard('url', {

  // Logged in domain root
  defaultLoggedInRoute: 'feed',

  defaultLoggedOffRoute: 'register',
  
  // Array containing routes that revert to defaultRoute
  revertToDefault: ['', '#', 'archive'],

  // Logged-off routes
  loggedOffRoutes: ['login', 'register'],

  // Logged-in, but not group-specific routes
  loggedInRoutes: ['settings'],

  isLoggedOffRoute: function (route) {
    return this.loggedOffRoutes.indexOf(route) >= 0;
  },

  isLoggedInRoute: function (route) {
    return this.loggedInRoutes.indexOf(route) >= 0;
  },

  stripSlashes: function (pathname) {
    // Strip leading slash
    if (pathname.charAt(0) == "/")
      pathname = pathname.substr(1);

    // Strip trailing slash
    if (pathname.charAt(pathname.length - 1) == "/")
      pathname = pathname.substr(0, pathname.length - 1);

    return pathname;
  },

  urlComponent: function(href) {

    // Initiate parser
    var parser = document.createElement('a');
    parser.href = href;

    // Strip trailing and leading slashes of pathname
    var pathname = this.stripSlashes( parser.pathname );

    // Get controller
    var split_pathname = pathname.split('/');
        controller     = split_pathname[0];

    // Instanciate variables
    var group = "", route = "";

    // Rules
    if ( pathname == '' ) {

      // Root directory
      route = asocial.state.system.logged_in ?
        'groups' : this.defaultLoggedOffRoute;

    } else if ( this.isLoggedInRoute(controller) ) {

      // Logged-in, not group-specific
      route = controller;

    } else {

      if ( this.isLoggedOffRoute(controller) ) {

        // Logged-off, non-root
        route = controller;

      } else {

        // Logged-in, group-specific
        group = controller;
        route = split_pathname[1] ? split_pathname[1] : this.defaultLoggedInRoute;

      }

    }

    // Return urlComponent object
    return {
      group:  group,
      route:  route,
      binder: asocial.binders.getBinderFromRoute(route),
      url:    pathname
    };

  }

});