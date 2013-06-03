guard('binders', {

  /* ----- CORE FUNCTIONS ----- */

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

    // Bind global
    $().binders['global']['main']();

    // Bind HBS navigation
    this.hbsNavigation();

    // Execute every binded function to route
    var obj = $().binders[route], key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) obj[key]();
    }
  },

  unbind: function() {

    // Unbind global events
    $(document).off();

    // Unbind page events
    $('#main').off();

    // Unlock potential socket locking
    $(window).data('lockSocketUpdating', false);

    // Unbind HBS links
    $(document).off('click', 'a[data-hbs]');

    // Deactivate and reset infinite scrolling
    $(window).off('scroll');
    $(window).data('infinite-scroll-done'  , false)
             .data('infinite-scroll-async' , false)
             .data('infinite-scroll-manual', false);
  },

  /* ----- HBS NAVIGATION AND URL HANDLING ----- */

  // Load a urlComponent object into a container
  loadUrlComponent: function(urlComponent, container, callback) {

    console.log('Loading url Components', urlComponent);

    var _this = this;
    var callback = callback || function () {};

    // Fallback
    if (!window.History.enabled)
      location.href = urlComponent.url;

    // Error log
    if (typeof(urlComponent.binder) === "undefined")
      console.log('No binders specified');

    // Default container
    container = container || $('#main');

    if ( asocial.url.isLoggedOffRoute(urlComponent.route) ) {

      container.html( Fifty.render(urlComponent.route) );
      this.bind(urlComponent.binder);
      callback();

    } else {

      if (asocial.state.system.logged_in) {

        // Get the user's state (password key, user id, keypair) from server.
        asocial.state.getState('user', function (authorized) {

          // Show login screen if the user's state cannot be supplied.
          if (!authorized) { return _this.goToUrl('/', $('body')); }

          // Authorize the user locally by checking for his keypair
          // and authorizing from a locally stored password otherwise.
          asocial.auth.authorizeForUser(function (authorized) {

            // Show the login screen if the user can't be authorized.
            if (!authorized) { return _this.goToUrl('/', $('body')); }

            // Get the user's socket after state and authorization are done.
            asocial.socket.listen();

            // If the route pertains to a group,
            if (urlComponent.group)  {

              // Get the group's state (keylist, user list) from server.
              asocial.state.getState('group', function (authorized) {

                // Authorize the user for the group by checking for
                // ability to decrypt the group keylist.
                asocial.auth.authorizeForGroup( function (authorized) {

                  // Render the group route and callback.
                  _this.renderRoute(urlComponent, container);
                  callback();

                });

              // Pass the name of the group to getState().
              }, { group: urlComponent.group });

            // If the route pertains to a user,
            } else {

              // Just render the route and callback.
              _this.renderRoute(urlComponent, container);
              callback();

            }

          });

        });

      } else {

        //$('body').html( Fifty.render('error-notfound') );
        window.location = '/';

      }
    }

  },

  renderRoute: function(urlComponent, container) {

    var _this = this;

    var template = urlComponent.route;
    var url = '/' + urlComponent.url;

    // Get JSON and fill HBS template
    Fifty.getAndRender(template, url, function(html) {

      if (html) {
        // Success
        container.html(html);
        _this.bind(urlComponent.binder);
      } else {

        // Failure
        $('body').html( Fifty.render('error-notfound') );
        _this.unbind();

      }

    });

  },

  hbsNavigation : function() {

    var _this = this;

    // Prepare History object
    var History = window.History;

    // Check if Pushstate/popstate is available
    if ( !History.enabled ) {

      // Pushstate/popstate are unavailable. Fallback.
      $(document).off('click', 'a[data-hbs]')
        .on('click', 'a[data-hbs]', function(e) {

        var urlComponent = asocial.url.urlComponent(e.currentTarget.href);

        $(this).attr('href', '/' + urlComponent.url);

      });

      return false;
    }

    // Statechange (handles forward and backward navigation)
    $(window).off('statechange')
      .on('statechange', function() {
        _this.loadCurrentUrl();
    });

    // Forward navigation
    $(document).off('click', 'a[data-hbs]')
      .on('click', 'a[data-hbs]', function(e) {

      e.preventDefault();

      var parser = document.createElement('a');
      parser.href = e.currentTarget.href;

      if (parser.pathname == '/' && window.location.pathname == '/') {
        _this.loadUrl('/');
      } else {
        History.pushState({}, window.document.title, e.currentTarget.href);
      }


    });

  },

  /* ----- SHORTCUTS ----- */

  loadCurrentUrl: function (callback) {

    this.loadUrl(window.location.href, callback);
  },

  loadUrl: function(url, callback) {

    var _this = this;

    // Get system state and load appropriate route.
    asocial.state.getState('system', function (authorized) {

      // Get URL components of current URL
      var urlComponent = asocial.url.urlComponent(url);

      // Initialize variable
      var container;

      // Render container if user is logged in
      if (asocial.state.system.logged_in) {
        // Render HBS Container
        $('body').html( Fifty.render('container') );

        asocial.state.getState('notifications', function () {

          $.each(asocial.state.notifications, function (index, notification) {

            $('#notifications-content').append(

              Fifty.render('feed-notification', {
                html: asocial.helpers.notificationText(notification),
                owner: notification.owner
              })

            );

            asocial.crypto.decryptAvatars();

          });

          if ($('#notifications-content').children().length == 0) {
            $('#notifications-content').html(
              Fifty.render('feed-notifications-empty'));
          }

        });

      } else {
        // If logged off, render in entire page
        container = $('body');
      }

      // Load route
      _this.loadUrlComponent(urlComponent, container, callback);

    });

  },

  goToUrl: function(href) {

    var urlComponent = asocial.url.urlComponent(href);
    History.pushState({}, window.document.title, href);

  },

  // Helpers

  getCurrentGroup: function(route) {
    // If there is a group, return group name; otherwise false.
    var group = asocial.url.urlComponent(window.location.href).group
    return typeof(group) === "undefined" ? '' : group;
  },

  getBinderFromRoute: function(route) {
    return  asocial.url.revertToDefault.indexOf(route) === -1 ?
            route : asocial.url.defaultRoute;
  }

});