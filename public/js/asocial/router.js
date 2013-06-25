Router = Backbone.Router.extend({

  /* RULES */

  routes: {

    /* Root */

    '': 'root',

    /* Logged-off routes */

    'login':    'login',
    'register': 'register',
    'logout':   'logout',

    /* Logged-in routes */

    'users/:user_id': 'user',
    'users/:user_id/groups': 'userGroups',
    'users/:user_id/groups/:group_id(/page-:page)': 'userGroup',
    'users/:user_id/groups/:group_id/posts/:post_id': 'userGroupPost',
    'users/:user_id/groups/:group_id/archive/:year(-:month)(/page-:page)': 'userGroupArchive',

    /* Catch-all for 404 */

    '*catchall': 'notfound'

  },

  /* ROOT */

  root: function() {
    this.authenticate(
      function() {
        // If there is a user, go to groups
        var route = '/users/' + asocial.state.user.id + '/groups';
        Router.navigate(route, { trigger: true, replace: true });
      },

      function(){
        // Otherwise, go to register
        Router.navigate('/register', { trigger: true, replace: true });
      }
    );
  },

  /* LOGGED-OFF ROUTES */

  login: function() {
    this.loadStaticPage('login', true);
  },

  register: function() {
    this.loadStaticPage('register', true);
  },

  logout: function() {
    window.location = '/';
  },

  /* LOGGED-IN ROUTES */

  userGroups: function(user_id) {
    this.loadDynamicPage('groups');
  },

  userGroup: function(user_id, group_id) {
    this.loadDynamicPage('feed', group_id);
  },

  userGroupPost: function(user_id, group_id, post_id) {
    this.loadDynamicPage('feed', group_id);
  },

  /* ERRORS */

  notfound: function(){
    this.loadStaticPage('error-notfound');
  },

  error: function(){
    // Redirect to error page
    alert('Fatal error');
  },

  /* HELPERS */

  loadStaticPage: function(template, logged_off_only) {

    // By default, static pages can be accessed while logged in
    var logged_off_only = logged_off_only || false;

    var renderStaticPage = function() {

      // Render template
      var view = Handlebars.templates[template + '.hbs']();

      // Fill body
      $('body').html(view);

      // Binders
      asocial.binders.bind(template);

    };

    // If route is logged_off only
    logged_off_only ?
      // Not found if logged in, render if logged off
      this.authenticate( function(){ Router.notfound() }, renderStaticPage ) :
      // Otherwise, render
      renderStaticPage();

  },

  loadDynamicPage: function (template, group_id) {

    // Optional group id for routes that require group authentication
    var group_id = group_id || false;

    // Show spinner
    $('#spinner').show();

    this.authenticate(function(){

      // If the route isn't group specific, render page now that
      // all authentications and authorizations have been done.
      if(!group_id) return Router.renderDynamicTemplate(template);

      // Otherwise, authorize user for group
      asocial.state.getState('group', function (authorized) {

        // User can't access group: error
        if(!authorized) return Router.error();

        // Check if need to integrate user within a group (1st
        // visit on group) or if need to update a user's keylist
        // (meaning one or more new users have joined the group).
        asocial.state.getState('invite', function (authorized) {

          // User can't access invite: error
          if(!authorized) return Router.error();

          if (asocial.state.invite.integrate) {
            
            asocial.invite.integrate(function () {
              Router.renderDynamicTemplate(template);
            });
            
          } else if (asocial.state.invite.update) {
            asocial.invite.update(function () {
              Router.renderDynamicTemplate(template);
            });
            
          } else {
          
            // Authorize the user for the group by checking for
            // ability to decrypt the group keylist.
            asocial.auth.authorizeForGroup( function (authorized) {
              // User can't decrypt group keylist: error
              if(!authorized) return Router.error();
              Router.renderDynamicTemplate(template);
            });

          }

        }, { group_id: asocial.state.group.id });

      }, { group_id: group_id });

    }, function() {

      // If there is no user, go back to register
      Router.navigate('/register', { trigger: true, replace: true });

    });

  },
  
  renderDynamicTemplate: function(template) {

    // Get current URL
    var url = '/' + Backbone.history.fragment;

    // Retreive data
    $.getJSON(url, function (data) {

      // If container doesn't exist
      if( !$('#main').length ) {
        // Render it
        $('body').html( Handlebars.templates['container.hbs']() );

        // Initiate notifications
        Router.renderNotifications();
      }

      // Render template
      var view = Handlebars.templates[template + '.hbs'](data);

      // Fill container with template
      $('#main').html(view);

      // Binders
      asocial.binders.bind(template);

      // Hide spinner
      $('#spinner').hide();

    }).fail(Router.error);

  },

  authenticate: function(success, failure) {

    // If there is already a session, success
    if (asocial.state.session) return success();

    // Otherwise, authentificate
    asocial.state.getState('system', function () {

      // If there is no user, failure
      if (!asocial.state.system.logged_in) return failure();

      // Create session, then success
      asocial.state.session = new Session(success);

    });

  },

  // Move that out of here
  renderNotifications: function() {

    asocial.state.getState('notifications', function () {

      $.each(asocial.state.notifications, function (index, notification) {

        $('#notifications-content').append(
          asocial.helpers.render('feed-notification', {
            html: asocial.helpers.notificationText(notification),
            id: notification.id,
            created_at: notification.created_at,
            owner: notification.owner
          })
        );

      });

      if ($('#notifications-content').children().length == 0) {

        $('#notifications-content').html(
          asocial.helpers.render('feed-notifications-empty'));

      } else {

        $('#notifications')
          .prepend('<span class="notification-badge">' +
            asocial.state.notifications.length + '</a>');

      }

    }, { force: true });

  },

  reload: function () {
    Backbone.history.loadUrl(Backbone.history.fragment);
  }

});