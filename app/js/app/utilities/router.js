Syme.Router = Backbone.Router.extend({

  /* NAVIGATION AND CUSTOM FUNCTIONS */

  currentRoute: '',

  startHistory: function() {
    Backbone.history.start({ pushState: true });
  },

  navigate: function (fragment, options) {

    options = options || { trigger: true, replace: true };

    try {

      // Set fragment
      fragment = Backbone.history.getFragment( fragment || '' );
      this.currentRoute = fragment;

      // Fake pushstate and load directly
      Backbone.history.loadUrl(fragment);

    } catch (e) {
      console.error(e, 'Could not navigate to ' + fragment);
    }

  },

  checkForUnsavedContent: function(passCb) {

    // Verify if unsaved content is present.
    var unsavedContent = _.any($('textarea'), function (textarea) {
      return textarea.value != '';
    });

    if (unsavedContent) {

      Confirm.show(Syme.Messages.error.unsavedContent, {

        closable: true,
        title: 'Confirm Navigation',
        submit: 'Leave this page',
        cancel: 'Stay on this page',

        onsubmit: passCb

      });

    } else { passCb(); }

  },

  insideGroup: function () {

    var bits = this.currentRoute.split('/');
    return bits[bits.length-1] != 'groups';

  },

  /* ROUTES */

  routes: {

    /* Root */

    '': 'root',
    'syme.html': 'root',

    /* Logged-off routes */

    'login':    'login',
    'register': 'register',
    'logout':   'logout',
    'confirm': 'confirm',

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

    var _this = this;

    // Verify if the user is currently authenticated or not.
    _this.authenticate(

      // If the user is authenticated, go to groups page.
      function() {
        var userId = Syme.CurrentSession.getUserId();
        _this.navigate('/users/' + userId + '/groups');
      },

      // If the user is not authenticated, show login or register.
      function(){

        // Choose whether to go to login or register based on history.
        if (Syme.Compatibility.inChromeExtension()) {

          chrome.storage.local.get('hasRegistered', function (setting) {
            _this.navigate(setting.hasRegistered ? 'login' : 'register');
          });

        // If in development mode, always go to login for convenience.
        } else {
          _this.navigate('login');
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
  
  confirm: function () {
    this.loadStaticPage('confirm', true);
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

  error: function(error){

    Alert.show(
      Syme.Messages.error.fatal,
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
    var view = Handlebars.templates[template]();

    // Fill body
    $('body').html(view);

    // Binders
    Syme.Binders.bind(template);


  },

  loadDynamicPage: function (template, groupId, specificBinders) {

    // Optional group id for routes that require group authentication
    var groupId = groupId || false;

    // Show spinner while waiting for AJAX if there is a container
    if ( $('#main').length ) NProgress.showSpinner();

    this.authenticate(function(){

      var user = Syme.CurrentSession.getUser();

      // If the route isn't group specific, render page now that
      // all authentications and authorizations have been done.
      if(groupId) {

        Syme.globals.updatedPosts[groupId]    = 0;
        Syme.globals.updatedComments[groupId] = 0;

        Syme.CurrentSession.setGroupId(groupId);

      }

      user.getAllGroupUpdates(function () {
        Syme.Router.renderDynamicTemplate(template, specificBinders);
      });

    }, function() {

      // If there is no user, go back to register
      Syme.Router.navigate('/register', {
        trigger: true, replace: true });

    });

  },

  renderDynamicTemplate: function(template, specific_binders) {

    var _this = this;

    // Get current URL
    var url = SERVER_URL + '/' + Backbone.history.fragment;

    // Temporary fix while Backbone sync isnt encrypted
    var fn = template == 'settings' ? $.ajax : $.encryptedAjax;

    // Retrieve data
    fn(url, {

      type: 'GET',

      success: function (data) {


        if( template == 'feed' &&
            data.users.length == 1 &&
            data.invite.length == 0 ) {
          template = 'batchinviter';

        }

        // Initiate logged in template on first pageload
        if( !$('#main').length )
          Syme.Router.renderLoggedInTemplate();

        // Hide container and scroll to top
        $('#main').addClass('hidden');
        window.scrollTo(0,0);

        // Render template
        var view = Handlebars.compileTemplate(template, data);

        // Fill container with template
        $('#main').html(view);

        // Binders
        Syme.Binders.bind(template, true, specific_binders);

        _this.showBreadCrumbs(template, data);

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

      }
    });

  },

  showBreadCrumbs: function (template, data) {

    switch(template) {

      case 'groups':

        if (template == 'groups' &&
            data.groups.length == 0 &&
            data.invites == false) {

          var crumbs = [
            { title: 'My groups', href: '/' },
            { title: 'Create your first group', href: '#' }
          ];

        } else {

          var crumbs = [ { title: 'My groups', href: '/' } ];

        }

        break;

      case 'groups-first':

        var crumbs = [
          { title: 'My groups', href: '/' },
          { title: 'Create your first group', href: '#' }
        ];
        break;

      case 'settings':

        var crumbs = [ { title: 'My groups', href: '/' } ];
        break;

      case 'feed':

        var groupName = data.group.name;

        var currentGroupRoute = Syme.Url.join(
          'users', Syme.CurrentSession.getUserId(),
          'groups', Syme.CurrentSession.getGroupId()
        );

        var crumbs = [
          { title: 'My groups', href: '/' },
          { title: groupName, href: currentGroupRoute }
        ];

        break;

      case 'batchinviter':

        var groupName = data.group.name;

        var crumbs = [
          { title: 'My groups', href: '/' },
          { title: 'Invite people to ' + groupName,
          href: Syme.Router.currentRoute }
        ];

        break;

      default:

        throw 'Unkown action';

    }


    Syme.Navbar.setBreadCrumb({
      brand_only: false,
      elements: crumbs
    });

  },

  renderLoggedInTemplate: function() {
    // Render it
    $('body').html( Handlebars.templates['container']() );

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
  },

  reset: function () {
    Notifications.reset();
    Notifications.fetch();
    this.reload();
  }

});