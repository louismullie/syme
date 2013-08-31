Syme.Messages = {

  app: {
    
    outdated: "You seem to be using an "+
              "outdated version of Syme. Please update " +
              "your browser extension before continuing. <br> <br>" +
              "You can do this by entering <b>chrome://extensions/</b> " +
              "in your address bar, checking <b>\"Developer mode\"</b> and " +
              "cliking on <b>\"Update extensions now\"</b>.",
    
    maintenance: "Sorry, we're down for maintenance.  " +
                "Syme will be back up and running " +
                "as soon as possible. <br><br>Please "+
                " try again later.<br><br>",
  
    connection:  "Please check your Internet connection " +
                 "and try again."
  },
  
  beta: {
    
    warning: 'Syme is currently in an early beta phase. ' +
             'This means that we might make small changes to our ' +
             'software that could imply loss of your data. You ' +
             'should always keep backups of any important information ' +
             'that you share in your groups.'
    
  },
  
  file: {
    
    maxSize: 'You can only upload files of up to 25 Mb for now.'
    
  },
  
  error: {
    
    registration: {
    
      email_taken: 'This e-mail is already taken.'
      
    },
    
    fatal: 'An error has occured. We\'ve been notified ' +
           'and we\'ll address this as soon as possible.',
    
    postingFailed: 'Posting failed (PUT)!',
    
    invitationNotFound: 'This invitation does not exist anymore.',
    
    unsavedContent: 'You have unsaved content on this page.',
    
    invitation: {
      
      already_joined: 'already in the group',
      already_invited: 'already accepted an invitation to this group',
      own_email: 'this is your e-mail',
      validation: 'this is not a valid e-mail'
      
    }
  
  },
  
  modals: {
    
    confirm: {
      
      deleteUser: {
        title: 'Delete user',
        message: 'Do you really want to delete this user from the group?',
        submit: 'Delete',
        cancel: 'Cancel'
      },
      
      deleteGroup: {
        title: 'Delete group',
        message: 'Are you sure you want to delete this group ' +
                  'and all of its content? This is irreversible.' +
                  '<br>Type <b>delete</b> below to confirm.',
        submit: 'Delete',
        cancel: 'Cancel'
        
      },
      
      leaveGroup: {

        message: 'Do you really want to leave this group?',
        title: 'Leave group',
        submit: 'Leave',
        cancel: 'Cancel'

      }
      
    },
    
    alert: {
      
      disconnected: {

        message: 'You have been disconnected',
        title: 'Disconnected',
        submit: 'Log in'

      }
      
    }
  },
  
  notifications: {
    
    resources: {
      groups:  'users/%(current_id)s/groups',
      group:   'users/%(current_id)s/groups/%(group_id)s',
      post:    'users/%(current_id)s/groups/%(group_id)s/posts/%(post_id)s',
      comment: 'users/%(current_id)s/groups/%(group_id)s/posts/%(post_id)s'
    },
    
    types: {

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
      },
      
      delete_group: {
        message: '%(actors)s deleted %(resource)s',
        resource: 'group'
      }

    }
  }
  
};