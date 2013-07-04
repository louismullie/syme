asocial.binders.add('feed', { panel: function(){

  // Group photo edit button action
  $('#group-photo-edit').click(function(e){
    if($(this).data('active')) return;
    $('#group-photo-file').trigger('click');
  });

  // Group photo upload
  $('#main').on('change', '#group-photo-file', function(){

    var trigger = $('#group-photo-edit');

    // Get filename
    var filename = asocial.helpers.getFilename($(this).val());

    // Return if filename is blank
    if (filename == '') return;

    trigger
      // Lock trigger
      .data('active', true)
      // Show spinner
      .addClass('active');

    // Thumbnail and upload avatar
    asocial.uploader.selectGroupAvatar(
      // Filename
      $(this)[0].files[0],

      // Thumnail callback
      function(url) {
        // Replace thumbnail in DOM
        $('#group-photo-edit img').attr('src', url);
      },

      // Success callback
      function() {
        trigger
          // Unlock trigger
          .data('active', false)
          // Remove spinner
          .removeClass('active');
      }
    );

  });

  // Add new user
  $('#main').on('click', 'a#add-user', function(){

    var content = asocial.helpers.render('feed-modals-invite');

    asocial.helpers.showModal(content, {

      classes: 'modal-invite',

      // Specify onsubmit() to prevent normal submitting enter key
      // or submit button, and rather delegate it to the submit()
      // event specified in onshow()

      onsubmit: function() { },

      onshow: function() {

        // Initial textarea autosizing
        $('textarea.autogrow').autogrow().removeClass('autogrow');

        // Bind form action directly, to avoid event persistance
        $('#responsive-modal form').submit(function(e){

          var $this = $(this);

          // Return if event is locked
          if($this.data('active')) return false;

          var emails = $this.find('textarea[name="emails"]').val();

          // Return if textarea is blank
          if(!emails) return false;

          // Lock form
          $this.data('active', true);

          // Show spinner
          $this.find('a.modal-button').addClass('spinner');

          var inviteEmailsFromTextarea = function(emails, callback) {

            // Validate emails and eliminate duplicates
            var validatedEmails = [];
            _.each(emails.split("\n"), function(email){
              if( $.ndbValidator.regexps.email.test(email) )
                validatedEmails.push(email);
            });
            validatedEmails = _.uniq(validatedEmails);

            var inviteQueue = _.clone(validatedEmails),
                succeededInvitations = [],
                failedInvitations = {};

            // Send invitations to validate emails
            _.each(validatedEmails, function(validatedEmail){

              // Submit invite
              var user = CurrentSession.getUser();
              var groupId = CurrentSession.getGroupId();

              user.createInviteRequest(groupId, validatedEmail, function () {

                succeededInvitations.push(validatedEmail);

                // Remove concerned email from queue
                inviteQueue = _.without(inviteQueue, validatedEmail);

                // If queue is empty, callback with
                // { succeeded: [*emails], failed: {*email: reason} }
                if(inviteQueue.length == 0) callback({
                  succeeded: succeededInvitations, failed: failedInvitations
                });

              }, function () {

                failedInvitations[validatedEmail] = data.status;

                // Remove concerned email from queue
                inviteQueue = _.without(inviteQueue, validatedEmail);

                // If queue is empty, callback with
                // { succeeded: [*emails], failed: {*email: reason} }
                if(inviteQueue.length == 0) callback({
                  succeeded: succeededInvitations, failed: failedInvitations
                });

              });


            });

          };

          inviteEmailsFromTextarea(emails, function(log){

            // Remove own_email errors
            _.each(log.failed, function(value, key){
              if ( value == "own_email" ) log.failed = _.omit(log.failed, key);
            });

            // If all trys failed, throw system error
            if ( log.failed.length == emails.length)
              return asocial.helpers.showAlert(
                'There has been an error in the invite process.'
              );

            if ( _.size(log.failed) == 0 ) {
              // If failed is empty, remove it from log
              // for templating purposes
              log = _.omit(log, 'failed');
            } else {
              // Discard reasons by converting to array of values
              log.failed = _.keys(log.failed);
            }

            // Compile success template with log
            template = asocial.helpers.render('feed-modals-invite-success', log);

            // Show modal
            asocial.helpers.showAlert(template, {
              classes: 'modal-invite', title: 'Success'
            });

          });

        });

      }

    });

  });

  $('#main').on('click', '.delete-user', function (e) {
    
    var userId = $(this).parent().attr('id');
    
  // Delete user button toggling
  $('#main').on({
    mouseenter: function(){
      $(this).find('a.user-delete').first()
        .css({ display: 'block' })
        .transition({ opacity: 1}, 100);
    },
    mouseleave: function(){
      $(this).find('a.user-delete').first()
        .transition({ opacity: 0}, 100)
        .css({ display: 'none' });
    }
  }, 'ul#userlist > li');

  // Delete user
  $('#main').on('click', '.user-delete', function (e) {

    asocial.helpers.showConfirm(
      'Do you really want to delete this user from the group?',
      {
        closable: true,
        title: 'Delete user',
        submit: 'Delete',
        cancel: 'Cancel',

        onsubmit: function(){
          
          var route = SERVER_URL + '/users/' + CurrentSession.getUserId() + 
          '/groups/' + CurrentSession.getGroupId() + '/memberships/' + userId;
          
          $.ajax(route, { type: 'DELETE',
          
            success: function () {
              Router.reload();
            },
            
            error: function () {
              alert('Could not delete user!');
            }
          
          });
          
        }
      }
    );
  });


} }); // asocial.binders.add();