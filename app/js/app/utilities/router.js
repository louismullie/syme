Syme.Router = Backbone.Router.extend({

  /* RULES */

  currentRoute: '',

  navigate: function (fragment, options) {

    var _this = this;

    // Verify if unsaved content is present.
    var unsavedContent = _.any($('textarea'),
      function (textarea) { return textarea.value != ''; });

    // Show confirm modal if unsaved content exists.
    if (unsavedContent) {

      Confirm.show(

        Syme.Messages.error.unsavedContent,
        {
          closable: true,
          title: 'Confirm Navigation',
          submit: 'Leave this page',
          cancel: 'Stay on this page',

          onsubmit: function(){
            _this.doNavigate(fragment, options);
          }

        }
      );

    } else {
      this.doNavigate(fragment, options);
    }

  },

  doNavigate: function (fragment, options) {

    // Set fragment
    fragment = Backbone.history.getFragment( fragment || '' );

    this.currentRoute = fragment;

    // Override pushstate and load url directly
    Backbone.history.loadUrl(fragment);

    // Scroll to top
    window.scrollTo(0,0);

  },

  insideGroup: function () {

    var bits = this.currentRoute.split('/');
    return bits[bits.length-1] != 'groups';

  },

  routes: {

    /* Root */

    '': 'root',
    'syme.html': 'root',

    /* Logged-off routes */

    'login':    'login',
    'register': 'register',
    'logout':   'logout',

    /* Logged-in routes */

    'users/:user_id': 'user',
    'users/:user_id/groups': 'userGroups',
    'users/:user_id/groups/:group_id': 'userGroup',
    'users/:user_id/groups/:group_id/posts/:post_id': 'userGroupPost',
    'users/:user_id/groups/:group_id/archive/:year(-:month)(/page-:page)': 'userGroupArchive',

    /* Catch-all for 404 */

    '*catchall': 'notfound'

  },

  /* ROOT */

  root: function() {

    // Helper function to navigate to a given route.
    var navigate = function (route) {
      Syme.Router.navigate(route, { trigger: true, replace: true });
    }

    // Verify if the user is currently authenticated or not.
    this.authenticate(

      // If the user is authenticated, go to groups page.
      function() {
        var userId = Syme.CurrentSession.getUserId();
        navigate('/users/' + userId + '/groups');
      },

      // If the user is not authenticated, show login or register.
      function(){

        // Choose whether to go to login or register based on history.
        if (Syme.Compatibility.inChromeExtension()) {

          chrome.storage.local.get('hasRegistered', function (setting) {
            navigate(setting.hasRegistered ? 'login' : 'register');
          });

        // If in development mode, always go to login for convenience.
        } else {
          navigate('login');
        }

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
    Syme.Auth.logout(function () {
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

    ONE_PAGE_VIEW = false; // FIX

    this.loadDynamicPage('feed', group_id);
  },

  userGroupPost: function(user_id, group_id, post_id) {

    ONE_PAGE_VIEW = true; // FIX

    this.loadDynamicPage('feed', group_id,
      // Specific binders
      ['comments', 'posts', 'main', 'panel', 'shared', 'invite']);
  },

  /* ERRORS */

  notfound: function(){
    this.loadStaticPage('error-notfound');
  },

  error: function(error){

    Alert.show(
      Syme.Messages.errors.fatal,
      {
        title: 'Oops! Something went wrong.',
        onhide: Syme.Auth.disconnect
      }
    );

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
          Syme.Router.notfound();
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
    Syme.Binders.bind(template);


  },

  loadDynamicPage: function (template, groupId, specificBinders) {

    // Optional group id for routes that require group authentication
    var groupId = groupId || false;

    // Clear breadcrumbs
    $('#navbar-breadcrumbs').html('');

    // Show spinner
    NProgress.start();

    var _this = this;

    this.authenticate(function(){

      var user = Syme.CurrentSession.getUser();

      // If the route isn't group specific, render page now that
      // all authentications and authorizations have been done.
      if(!groupId) {

        user.getAllGroupUpdates(function () {
          Syme.Router.renderDynamicTemplate(template, specificBinders);
        });

      } else {

        Syme.globals.updatedPosts[groupId] = 0;
        Syme.globals.updatedComments[groupId] = 0;

        Syme.CurrentSession.setGroupId(groupId);

        user.getAllGroupUpdates(function () {
          Syme.Router.renderDynamicTemplate(template, specificBinders);
        });

      }

    }, function() {

      // If there is no user, go back to register
      Syme.Router.navigate('/register', {
        trigger: true, replace: true });

    });

  },

  renderDynamicTemplate: function(template, specific_binders) {

    // Get current URL
    var url = SERVER_URL + '/' + Backbone.history.fragment;

    // Temporary fix while Backbone sync isnt encrypted
    var fn = template == 'settings' ? $.ajax : $.encryptedAjax;

    // Retrieve data
    fn(url, {

      type: 'GET',

      success: function (data) {

        // First pageload: initiate logged in template
        if( !$('#main').length ) Syme.Router.renderLoggedInTemplate();

        // Render template
        var view = Handlebars.compileTemplate(template, data);

        // Fill container with template
        $('#main').html(view);

        // Binders
        Syme.Binders.bind(template, true, specific_binders);

      },

      error: function(response){

      if(response.status == 401) {

        // User has been logged off.
        Syme.Auth.disconnect();

      } else if (response.status == 404) {

        // Post or group doesn't exist
        NProgress.done();

        Alert.show(
          "This content has been removed by its owner."
        );

      } else {

        // Fatal error
        Syme.Router.error();

      }
    }});

  },

  renderLoggedInTemplate: function() {
    // Render it
    $('body').html( Handlebars.templates['container.hbs']() );

    // Fetch notifications.
    Notifications.start();

    // Initialize socket.
    Syme.Socket.listen();
  },

  authenticate: function(success, failure) {

    // If there is already a session, success
    if (Syme.CurrentSession && Syme.CurrentSession.initialized) {
      return success();
    } else {
      return failure();
    }

  },

  reload: function () {
    Backbone.history.loadUrl(Backbone.history.fragment);
  }

});