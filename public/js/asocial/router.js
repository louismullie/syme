Router = Backbone.Router.extend({

  /* RULES */

  navigate: function (url) {

    // Override pushstate and load url directly
    Backbone.history.loadUrl(url);

  },

  routes: {

    /* Root */

    '': 'root',
    'asocial.html': 'root',

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
        var route = '/users/' + CurrentSession.getUserId() + '/groups';
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
    asocial.auth.logout(function () {
      window.location = '';
    });
  },

  /* LOGGED-IN ROUTES */

  userGroups: function(user_id) {
    this.loadDynamicPage('groups');
  },

  userGroup: function(user_id, group_id) {
    this.loadDynamicPage('feed', group_id);
  },

  userGroupPost: function(user_id, group_id, post_id) {
    this.loadDynamicPage('feed', group_id,
      // Specific binders
      ['comments', 'post', 'main', 'panel', 'shared', 'invite']);
  },

  /* ERRORS */

  notfound: function(){
    this.loadStaticPage('error-notfound');
  },

  error: function(){
    // Redirect to error page
    asocial.error.fatalError();
  },

  /* HELPERS */

  loadStaticPage: function(template, logged_off_only) {

    // By default, static pages can be accessed while logged in
    var logged_off_only = logged_off_only || false;
    var _this = this;
    
    // If route is logged_off only
    if (logged_off_only) {
    
      this.authenticate(
        function () {
          Router.notfound();
        }, function () {
          _this.renderStaticPage(template)
      });
    
    // Otherwise, render
    } else {
      this.renderStaticPage();
    }
    
    return null;

  },

  renderStaticPage: function (template) {
    
    // Render template
    var view = Handlebars.templates[template + '.hbs']();

    
    // Fill body
    $('body').html(view);

    // Binders
    asocial.binders.bind(template);

  },
  
  loadDynamicPage: function (template, group_id, specific_binders) {

    // Optional group id for routes that require group authentication
    var group_id = group_id || false;

    // Show spinner
    $('#spinner').show();

    this.authenticate(function(){

      // If the route isn't group specific, render page now that
      // all authentications and authorizations have been done.
      if(!group_id) return Router.renderDynamicTemplate(template);
      
      CurrentSession.setGroupId(group_id);
      
      /*if (asocial.state.invite.integrate) {

        asocial.invite.integrate(function () {
          Router.renderDynamicTemplate(template, specific_binders);
        });

      } else if (asocial.state.invite.update) {
        asocial.invite.update(function () {
          Router.renderDynamicTemplate(template, specific_binders);
        });

      } else {*/

      Router.renderDynamicTemplate(template, specific_binders);

      //}

    }, function() {

      // If there is no user, go back to register
      Router.navigate('/register', {
        trigger: true, replace: true });

    });

  },

  renderDynamicTemplate: function(template, specific_binders) {

    // Get current URL
    var url = 'http://localhost:5000/' + Backbone.history.fragment;

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
      asocial.binders.bind(template, specific_binders);

      // Hide spinner
      $('#spinner').hide();

    }).fail(Router.error);

  },

  authenticate: function(success, failure) {

    // If there is already a session, success
    if (CurrentSession && CurrentSession.initialized)
      return success();
    else
      return failure();

  },

  // Move that out of here
  renderNotifications: function() {

    $.getJSON('/state/notifications', function (data) {

      $.each(data, function (index, notification) {

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

    });

  },

  reload: function () {
    Backbone.history.loadUrl(Backbone.history.fragment);
  }

});