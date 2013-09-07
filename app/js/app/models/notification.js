Notifications = (function(){

  // * View * //

  var View = Backbone.View.extend({

    initialize: function() {
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

    generateNotificationText: function (data) {

      var action = data.action;

      if (!action) throw 'Undefined notification action.';

      var type = Syme.Messages.notifications.types[action];

      if (!type) throw 'Undefined notification type' + action;

      var resources = Syme.Messages.notifications.resources;

      var link = sprintf(resources[type.resource], {

        current_id: Syme.CurrentSession.getUserId(),
        group_id: data.group_id,
        post_id: data.post_id,
        comment_id: data.comment_id

      });

      var resource = type.resource == 'group'
        ? data.group : type.resource;

      var message = sprintf(type.message, {
        actors: '<b>' + data.actors + '</b>',
        resource: resource,
        group_name: '<b>' + data.group + '</b>'
      });

      return { message: message, link: link };

    },

    render: function() {

      var _this = this;

      // Generate an array of unread notifications
      var selector = this.collection.where({ read: false }).reverse();

      // Iterate on each
      var notifications = _.select(selector, function (notification) {
        return notification.invalid != true;
      });

      // Return extended notification.attributes with generated content
      var notifications = _.map(notifications, function(notification){

        notification = notification.attributes;

        var data = _this.generateNotificationText(notification);

        return _.extend(notification, {
          message: data.message,
          link: notification.action == 'invite_request' ||
                notification.action == 'invite_accept'  ||
                notification.action == 'invite_cancel'  ||
                notification.action == 'delete_group'
            ? false : data.link
        });

      });

      // Show no notifications notice if there are no notifications;
      if(notifications.length == 0) notifications = false;

      // Render all notifications into element
      _this.$el.html( Syme.Template.render('notification',
        { notifications: notifications }) );

      // Update notification count in title, navbar and extension badge.
      Notifications.showBadge(selector.length);

    },

    events: {
      "click a.notification-link":    "markAsRead",
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
      $('.popover').hide();
      Invitation.acceptInvitationRequest($this);
    },

    declineInvitation: function (e) {
      var $this = $(e.currentTarget);
      $('.popover').hide();
      Invitation.cancelInvitationRequest($this);
    },

    confirmInvitation: function (e) {
      var $this = $(e.currentTarget);
      $('.popover').hide();
      Invitation.confirmInvitationRequest($this);
    },

    cancelInvitation: function (e) {
      var $this = $(e.currentTarget);
      $('.popover').hide();
      Invitation.cancelInvitationRequest($this);
    }

  });

  // * Model * //

  var Model = Backbone.Model.extend({});

  // * Collection * //

  var Collection = Backbone.Collection.extend({
    model: Model,

    // Call this when the DOM is loaded and Syme.CurrentSession is available
    start: function(){

      var userId = Syme.CurrentSession.getUserId();
      this.url = SERVER_URL + "/users/" + userId + "/notifications";
      this.view.setElement( $('#notifications-content') );

      // Fetch notifications
      this.fetch({ reset: true });
    },

    // Show notification count in title, navbar and browser bar badges.
    showBadge: function (count) {

      // Update notification count in the document title.
      var title = (count == '' ? 'Syme' : '(' + count + ') Syme');
      document.title = title;

      // Update notification count in the navbar badge.
      $('#notification-li').attr('data-badge', count);

      // Update notification count in extension bar.
      if (Syme.Compatibility.inChromeExtension()) {

        var formattedCount = count == 0 ? '' : count.toString();

        chrome.browserAction.setBadgeBackgroundColor({color: '#ff0011'});
        chrome.browserAction.setBadgeText({ text: formattedCount });

      }

    },

    // Hide badge in extension bar.
    hideBadge: function () {

      // Reset notification counter.
      if (Syme.Compatibility.inChromeExtension()) {
        chrome.browserAction.setBadgeText({ text: '' });
      }

    },

    clearAll: function () {

      var deleteNotificationsUrl = Syme.Url.fromCurrentUser('notifications');

      $.encryptedAjax(deleteNotificationsUrl, {

        type: 'DELETE',

        success: function () {
          Notifications.reset();
          Notifications.fetch();
        },

        error: function (response) {
          Syme.Error.ajaxError(response, 'clear', 'notification');
        }

      });

    }

  });

  // Build self-referring MVC
  Collection      = new Collection();
  View            = new View({ collection: Collection });
  Collection.view = View;

  return Collection;

})();