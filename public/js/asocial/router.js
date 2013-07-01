Router = Backbone.Router.extend({

  /* RULES */

  navigate: function (fragment, options) {

    var history = Backbone.history;

    // Default options and options === true to {trigger: options}
    // if (!options || options === true) options = {trigger: options};

    // Set fragment
    fragment = history.getFragment( fragment || '' );

    // // If pushState is available, push/replace fragment as data to preserve blank url.
    // console.log(options.replace ? 'replaceState' : 'pushState', { fragment: fragment });
    // if (history._hasPushState)
    //   History[options.replace ? 'replaceState' : 'pushState'](
    //     { fragment: fragment }, document.title, '#'
    //   );

    // Override pushstate and load url directly
    history.loadUrl(fragment);

  },

  // Bypass checkURL to load the current pushed fragment
  // Unused for now
  // checkUrl: function(e) {
  //   var state = History.getLastStoredState();
  //   console.log('Old fragment: ', state.data.fragment);
  //   Backbone.history.loadUrl( state.data.fragment );
  // },

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

  user: function(user_id) {
    this.loadDynamicPage('settings');
  },

  userGroups: function(user_id) {
    this.loadDynamicPage('groups');
  },

  userGroup: function(user_id, group_id) {
    this.loadDynamicPage('feed', group_id);
  },

  userGroupPost: function(user_id, group_id, post_id) {
    this.loadDynamicPage('feed', group_id,
      // Specific binders
      ['comments', 'posts', 'main', 'panel', 'shared', 'invite']);
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
  
  loadDynamicPage: function (template, groupId, specific_binders) {

    // Optional group id for routes that require group authentication
    var groupId = groupId || false;

    // Show spinner
    $('#spinner').show();

    var _this = this;
    
    this.authenticate(function(){

      // If the route isn't group specific, render page now that
      // all authentications and authorizations have been done.
      if(!groupId) return Router.renderDynamicTemplate(template);
      
      CurrentSession.setGroupId(groupId);
      
      var user = CurrentSession.getUser();
      
      user.getGroupUpdates(groupId, function () {
        
        Router.renderDynamicTemplate(template, specific_binders);
        
      });

    }, function() {

      // If there is no user, go back to register
      Router.navigate('/register', {
        trigger: true, replace: true });

    });

  },

  renderDynamicTemplate: function(template, specific_binders) {

    // Get current URL
    var url = 'http://localhost:5000/' + Backbone.history.fragment;

    console.log('URL', url);

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
      var view = Handlebars.compileTemplate(template, data);
      
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

      var notificationCount = $('#notifications-content').children().length;
      
      if (notificationCount == 0) {

        $('#notifications-content').html(
          asocial.helpers.render('feed-notifications-empty'));

      } else {

        $('#notifications')
          .prepend('<span class="notification-badge">' +
            notificationCount + '</a>');

      }

    });

  },

  reload: function () {
    Backbone.history.loadUrl(Backbone.history.fragment);
  }

});