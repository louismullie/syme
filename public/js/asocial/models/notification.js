Notifications = (function(){

  var generateMessage = function(data) {

    var types = {

      // Posts

      new_post: {
        message: '%(actors)s posted a new %(ressource)s on %(group_name)s',
        ressource: "post"
      },

      // Comments

      comment_on_own_post: {
        message: '%(actors)s posted a new %(ressource)s on %(group_name)s',
        ressource: "comment"
      },

      comment_on_same_post: {
        message: '%(actors)s commented on the same %(ressource)s as you on %(group_name)s',
        ressource: "post"
      },

      // Likes

      like_on_post: {
        message: '%(actors)s liked your %(ressource)s on %(group_name)s',
        ressource: "post"
      },

      like_on_comment: {
        message: '%(actors)s liked your %(ressource)s on %(group_name)s',
        ressource: "comment"
      },

      // Mentions

      mention_in_post: {
        message: '%(actors)s mentioned you in a %(ressource)s on %(group_name)s',
        ressource: "post"
      },

      mention_in_comment: {
        message: '%(actors)s mentioned you in a %(ressource)s on %(group_name)s',
        ressource: "comment"
      },

      // Invitation/Confirmation

      request_invite: {
        message: '%(actors)s has invited you to join %(group_name)s',
        ressource: "groups"
      },

      confirm_invite: {
        message: '%(actors)s has joined the group %(ressource)s',
        ressource: "group"
      },

      confirm_join_request: {
        message: '%(actors)s has confirmed you to %(ressource)s',
        ressource: "group"
      }
    }

    var ressources = {
      groups:  'users/%(current_id)s/groups',
      group:   'users/%(current_id)s/groups/%(group_id)s',
      post:    'users/%(current_id)s/groups/%(group_id)s/posts/%(post_id)s',
      comment: 'users/%(current_id)s/groups/%(group_id)s/posts/%(post_id)s/comments/%(comment_id)s'
    }

    // If action doesn't exist, return false
    if ( !_.has(types, data.action) ) return false;

    var type = types[data.action];

    var link = sprintf(ressources[type.ressource], {

      current_id: CurrentSession.getUserId(),
      group_id: data.group_id,
      post_id: data.post_id,
      comment_id: data.comment_id

    });

    var ressource = '<a href="' + link + '" hbs">' + [type.ressource] + '</a>';

    var html = sprintf(type.message, {

      actors: '<b>' + data.actors + '</b>',
      ressource: ressource,
      group_name: '<b>' + data.group + '</b>'

    });

    return html;

  };

  // * View * //

  var View = Backbone.View.extend({

    initialize: function(){
      // Render when collection gets updated
      this.collection.on('sync', this.render, this);
    },

    render: function(){

      _this = this;

      // Compile data from models ( to refactor server-side )
      var notifications = _.map(this.collection.models, function(element){
        return element.attributes;
      });

      // Compile and prepend each
      _.each(notifications, function(notification){

        var message = generateMessage(notification);

        // Message doesn't exist in list
        if (!message) return;

        notification = _.extend(notification, {
          message: generateMessage(notification)
        });

        // Prepend (to-do: only changed) notifications
        _this.$el.html( asocial.helpers.render('notification', notification) );

      });

      // Update count
      var count = this.collection.models.length;
      $('#notification-li').attr('data-badge', count);

    },

    events: {
      "click a.read-notification": "markAsRead"
    },

    markAsRead: function(e){
      console.log('markAsRead with event', e);
    }

  });

  // * Model * //

  var Model = Backbone.Model.extend({
    idAttribute: "_id"
  });

  // * Collection * //

  var Collection = Backbone.Collection.extend({
    model: Model,
    url: "/state/notifications"
  });

  return new View({ collection: new Collection() });

})();