asocial.binders.add('feed', { invite: function() {

  // Confirm user
  $('.invite-confirm').click(function(e) {

    var $this = $(this);

    e.preventDefault();

    var invitationId  = $this.data('invite-id'),
        inviteeId     = $this.data('invite-invitee_id'),
        accept        = $this.data('invite-accept'),
        name          = $this.closest('.invite').find('span').attr('title'),
        user          = CurrentSession.getUser(),
        keylistId     = CurrentSession.getGroupId();

    // Render confirmation modal
    var confirm_modal = asocial.helpers.render(
      'feed-modals-confirm', { name: name }
    );

    // Show confirmation modal
    asocial.helpers.showModal(confirm_modal, {
      
      closable: false,
      classes: 'modal-alert',

      // Disable modal closing by enter key if button is disabled
      onsubmit: function(){
        return $('#responsive-modal a.modal-button').hasClass('disabled');
      },

      onshow: function(){

        //Proceed to confirmation
        user.confirmInviteRequest(invitationId, accept, function (confirmation) {
          user.transferKeysRequest(invitationId, inviteeId, function(){

            $('#responsive-modal a.modal-button')
              .text('Done!').removeClass('disabled');

          });
        }, function () {
          
          asocial.helpers.showConfirm(
            
            name + ' provided the wrong token.', {

            submit: 'Send new invite',
            cancel: 'Cancel invite',
            closable: false,

            onsubmit: function(){

              alert('Sending new invite');

            }
          });
          
          
        });

      }
    });

  });
  
  $('.invite-pending').on({
    
    
    click: function(e) {

    var $this = $(this);

    e.preventDefault();

    var invitationId  = $this.data('invite-id'),
        email         = $this.data('invite-email'),
        user          = CurrentSession.getUser(),
        keylistId     = CurrentSession.getGroupId();
    
    Crypto.getInvitationToken(keylistId, email, function (token) {
      
       prompt('Invitation token for ' + email, token);
      
    });

    },
    
    mouseenter: function (e) {
      
      $(this).text('View key');
      
    },
    
    mouseleave: function (e) {
      
      $(this).text('Pending');
      
    }
  
  });

  // Add new user
  $('#main').on('click', 'a#add-user, a#add-user-first', function(){

    var content = asocial.helpers.render('feed-modals-invite');

    asocial.helpers.showModal(content, {

      classes: 'modal-invite',

      // Specify onsubmit() to prevent normal submitting enter key
      // or submit button, and rather delegate it to the submit()
      // event specified in onshow()

      onsubmit: function() { return true; },

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

          // Parse emails and invite them all
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

              user.createInviteRequest(groupId, validatedEmail, function (inviteRequestToken) {

                succeededInvitations.push([validatedEmail, inviteRequestToken]);

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

          // Show confirmations and/or errors
          inviteEmailsFromTextarea(emails, function(log){

            _.each(log.succeeded, function(value, key){
              var email = value[0]; var token = value[1];
              alert(email + token);
            });
            
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

} }); // asocial.binders.add();