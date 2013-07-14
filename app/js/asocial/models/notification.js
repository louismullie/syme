Notifications = (function(){

  var generateNotification = function(data) {

    var types = {

      // Posts

      new_post: {
        message: '%(actors)s posted in %(group_name)s.',
        resource: "post"
      },

      // Comments

      comment_on_own_post: {
        message: '%(actors)s commented on your %(resource)s in %(group_name)s.',
        resource: "post"
      },

      comment_on_same_post: {
        message: '%(actors)s commented on the same %(resource)s as you in %(group_name)s.',
        resource: "post"
      },

      // Likes

      like_on_post: {
        message: '%(actors)s liked your %(resource)s in %(group_name)s.',
        resource: "post"
      },

      like_on_comment: {
        message: '%(actors)s liked your %(resource)s in %(group_name)s.',
        resource: "comment"
      },

      // Mentions

      mention_in_post: {
        message: '%(actors)s mentioned you in a %(resource)s in %(group_name)s.',
        resource: "post"
      },

      mention_in_comment: {
        message: '%(actors)s mentioned you in a %(resource)s in %(group_name)s.',
        resource: "comment"
      },

      // Picture updates

      group_picture_update: {
        message: "%(actors)s changed the group picture in %(resource)s.",
        resource: "group"
      },

      // Invitation/Confirmation

      invite_request: {
        message: '%(actors)s invited you to join %(group_name)s.',
        resource: "groups"
      },

      new_group_user: {
        message: '%(actors)s joined %(resource)s.',
        resource: "group"
      },


      invite_accept: {
        message: '%(actors)s accepted your invite to %(resource)s.',
        resource: "group"
      },

      invite_confirm: {
        message: '%(actors)s granted you access to %(resource)s.',
        resource: "group"
      },
      
      invite_cancel: {
        message: '%(actors)s canceled your invitation to %(resource)s.',
        resource: "group"
      },
      
      invite_decline: {
        message: '%(actors)s declined your invitation to %(resource)s.',
        resource: "group"
      },

      // Destructive operations
      leave_group: {
        message: '%(actors)s left %(resource)s',
        resource: "group"
      }

    };

    var resources = {
      groups:  'users/%(current_id)s/groups',
      group:   'users/%(current_id)s/groups/%(group_id)s',
      post:    'users/%(current_id)s/groups/%(group_id)s/posts/%(post_id)s',
      comment: 'users/%(current_id)s/groups/%(group_id)s/posts/%(post_id)s'
    }

    // If action doesn't exist, return false
    if ( !_.has(types, data.action) )
      throw 'Undefined message for ' + data.action;

    var type = types[data.action];

    var link = sprintf(resources[type.resource], {

      current_id: CurrentSession.getUserId(),
      group_id: data.group_id,
      post_id: data.post_id,
      comment_id: data.comment_id

    });

    var resource = type.resource == "group"
      ? data.group : type.resource;

    var message = sprintf(type.message, {
      actors: '<b>' + data.actors + '</b>',
      resource: resource,
      group_name: '<b>' + data.group + '</b>'
    });

    // Check if notification hasn't been displayed yet...
    //if (asocial.compat.inChromeExtension() &&
    //   $('notification[id="' + data.id + '"]').length < 1) {
    //
    //  var notificationText = message.replace(/<(?:.|\n)*?>/gm, '');
    //
    //  var notification = webkitNotifications.createNotification(
    //    'logo-48x48.png', 'New notification', notificationText
    //  );
    //
    //  notification.show();
    //
    //}

    return { message: message, link: link };

  };

  // * View * //

  var View = Backbone.View.extend({

    initialize: function(){
      // Called on modifications
      this.collection.on('sync change', this.render, this);

      // Called on first pageload
      this.collection.on('reset', function(){
        // First render
        this.render()

        // Bind add events for new items
        this.collection.on('add', this.render, this);
      }, this);
    },

    render: function(){

      _this = this;

      // Generate an array of unread notifications
      var selector = this.collection.where({ read: false }).reverse();

      // Iterate on each
      var notifications = _.select(selector, function (notification) {
        return notification.invalid != true;
      });

      // Return extended notification.attributes with generated content
      var notifications = _.map(notifications, function(notification){

        notification = notification.attributes;
        var data = generateNotification(notification);

        return _.extend(notification, {
          message: data.message,
          link: notification.action == 'invite_request' ||
                notification.action == 'invite_accept'
            ? false : data.link
        });

      });

      // Show no notifications notice if there are no notifications;
      if(notifications.length == 0) notifications = false;

      // Render all notifications into element
      _this.$el.html( asocial.helpers.render('notification',
        { notifications: notifications }) );

      // Update count
      $('#notification-li').attr('data-badge', selector.length);

      if (asocial.compat.inChromeExtension()) {

        var count = selector.length == 0 ? '' : selector.length.toString();
        chrome.browserAction.setBadgeText({ text: count });
        chrome.browserAction.setBadgeBackgroundColor({color: '#ff0011'});

      }

    },

    events: {
      "click a.notification-link":  "markAsRead",
      "click a.accept-invitation":    "acceptInvitation",
      "click a.decline-invitation":   "declineInvitation",
      "click a.confirm-invitation":   "confirmInvitation",
      "click a.cancel-invitation":    "cancelInvitation"
    },

    markAsRead: function(e){

      var id = $(e.currentTarget).closest('.notification').attr('id');
      var notification = this.collection.findWhere({ id: id });

      notification.save({ read: true }, { patch: true });
      
    },

    acceptInvitation: function (e) {
      var $this = $(e.currentTarget);
      asocial.invite.acceptInvitationRequest($this);
    },

    declineInvitation: function (e) {
      var $this = $(e.currentTarget);
      asocial.invite.cancelInvitationRequest($this);
    },

    confirmInvitation: function (e) {
      var $this = $(e.currentTarget);
      asocial.invite.confirmInvitationRequest($this);
    },

    cancelInvitation: function (e) {
      var $this = $(e.currentTarget);
      asocial.invite.cancelInvitationRequest($this);
    }

  });

  // * Model * //

  var Model = Backbone.Model.extend({});

  // * Collection * //

  var Collection = Backbone.Collection.extend({
    model: Model,

    // Call this when the DOM is loaded and CurrentSession is available
    start: function(){
      this.url = SERVER_URL + "/users/" + CurrentSession.getUserId() + "/notifications";
      this.view.setElement( $('#notifications-content') );

      // Fetch notifications
      this.fetch({ reset: true });
    }
  });

  // Build self-referring MVC
  Collection      = new Collection();
  View            = new View({ collection: Collection });
  Collection.view = View;

  return Collection;

})();