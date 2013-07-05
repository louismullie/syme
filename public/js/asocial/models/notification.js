Notifications = (function(){

  var generateNotificationText = function(data) {

    var types = {

      // Posts

      new_post: {
        message: '%(actors)s made a new %(resource)s in %(group_name)s',
        resource: "post"
      },

      // Comments

      comment_on_own_post: {
        message: '%(actors)s commented on your %(resource)s in %(group_name)s',
        resource: "post"
      },

      comment_on_same_post: {
        message: '%(actors)s commented on the same %(resource)s as you in %(group_name)s',
        resource: "post"
      },

      // Likes

      like_on_post: {
        message: '%(actors)s liked your %(resource)s in %(group_name)s',
        resource: "post"
      },

      like_on_comment: {
        message: '%(actors)s liked your %(resource)s in %(group_name)s',
        resource: "comment"
      },

      // Mentions

      mention_in_post: {
        message: '%(actors)s mentioned you in a %(resource)s in %(group_name)s',
        resource: "post"
      },

      mention_in_comment: {
        message: '%(actors)s mentioned you in a %(resource)s in %(group_name)s',
        resource: "comment"
      },

      // Invitation/Confirmation

      invite_request: {
        message: '%(actors)s invited you to join %(group_name)s. <a href="/" hbs>Confirm</a>.',
        resource: "groups"
      },

      new_group_user: {
        message: '%(actors)s joined %(group_name)s',
        resource: "group"
      },
      
      
      invite_accept: {
        message: '%(actors)s accepted your invite to %(group_name)s.',
        resource: "group"
      },

      invite_confirm: {
        message: '%(actors)s granted you access to %(resource)s',
        resource: "group"
      }
      
    }

    var resources = {
      groups:  'users/%(current_id)s/groups',
      group:   'users/%(current_id)s/groups/%(group_id)s',
      post:    'users/%(current_id)s/groups/%(group_id)s/posts/%(post_id)s',
      comment: 'users/%(current_id)s/groups/%(group_id)s/posts/%(post_id)s/comments/%(comment_id)s'
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

    var resource = '<a href="' + link + '" hbs>' + [type.resource] + '</a>';

    var html = sprintf(type.message, {

      actors: '<b>' + data.actors + '</b>',
      resource: resource,
      group_name: '<b>' + data.group + '</b>'

    });

    return html;

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
      var selector = this.collection.where({ read: false });

      // Iterate on each
      var notifications = _.map(selector, function(notification){
        // Return notification.attributes with an added message
        return _.extend(notification.attributes, {
          message: generateNotificationText(notification.attributes)
        });
      });

      // Show no notifications notice if there are no notifications;
      if(notifications.length == 0) notifications = false;

      // Render all notifications into element
      _this.$el.html( asocial.helpers.render('notification',
        { notifications: notifications }) );

      // Update count
      $('#notification-li').attr('data-badge', selector.length);

    },

    events: {
      "click a.notification-unread": "markAsRead"
    },

    markAsRead: function(e){
      e.preventDefault();
      e.stopPropagation();

      var id = $(e.currentTarget).closest('.notification').attr('id');
      var notification = this.collection.findWhere({ id: id });

      notification.save({ read: true }, {patch: true});
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