guard('invite', {

  // Parse emails and invite them all
  createInvitationRequest: function(emails, callback) {

    // Validate emails
    var validatedEmails = [],
        succeededInvitations = [],
        failedInvitations = {};

    _.each(emails.split("\n"), function(email){
      // If email is blank, skip it.
      if(email == "") return;

      if ( $.ndbValidator.regexps.email.test(email) ){
        validatedEmails.push(email);
      } else {
        failedInvitations[email] = 'validation';
      }
    });

    // Eliminate duplicates
    validatedEmails = _.uniq(validatedEmails);

    var inviteQueue = _.clone(validatedEmails);

    var checkForQueueCompletion = function(){

      // If queue is empty, callback with
      // { succeeded: [*{email, token}], failed: *{email: reason} }
      if(inviteQueue.length == 0) callback({
        succeeded: succeededInvitations,
        failed: failedInvitations
      });

    };

    // Send invitations to validate emails
    _.each(validatedEmails, function(validatedEmail){

      // Submit invite
      var user = CurrentSession.getUser();
      var groupId = CurrentSession.getGroupId();

      user.createInviteRequest(groupId, validatedEmail, function (inviteRequestToken) {

        succeededInvitations.push({ email: validatedEmail, token: inviteRequestToken});

        // Remove concerned email from queue
        inviteQueue = _.without(inviteQueue, validatedEmail);

        checkForQueueCompletion();

      }, function (model, response){
        
        var data = JSON.parse(response.responseText);
        
        failedInvitations[validatedEmail] = data.error;

        // Remove concerned email from queue
        inviteQueue = _.without(inviteQueue, validatedEmail);

        checkForQueueCompletion();

      });

    });

  },

  acceptInvitationRequest: function (inviteLink) {

    var user = CurrentSession.getUser();

    var invitationId = inviteLink.data('invite-id');
    var groupId = inviteLink.data('invite-group_id');
    var request = inviteLink.data('invite-request');

    var token = prompt('Enter your invitation token');

    user.acceptInviteRequest(invitationId, request, token, function () {
      Notifications.fetch();
      Router.reload();
      $('.popover').hide();
    });

  },

  cancelInvitationRequest: function (inviteLink) {

    var userId = CurrentSession.getUserId();
    var groupId = inviteLink.data('invite-group_id');
    var invitationId = inviteLink.data('invite-id');

    var url = SERVER_URL + '/users/' + userId +
      '/groups/' + groupId + '/invitations/' + invitationId;

    $.ajax(url, { type: 'DELETE',

      success: function () {
        Notifications.fetch();
        Router.reload();
        $('.popover').hide();
      },

      error: function (response) {
        if (response.status == 404) {
          asocial.helpers.showAlert(
            'This invitation does not exist anymore.');
        } else {
          alert('Could not decline invitation request.');
        }
      }

    });

  },

  confirmInvitationRequest: function (inviteLink) {

    var $this = inviteLink;

    var invitationId  = $this.data('invite-id'),
        inviteeId     = $this.data('invite-invitee_id'),
        accept        = $this.data('invite-accept'),
        email         = $this.data('invite-email'),
        name          = $this.data('invite-invitee_full_name'),
        user          = CurrentSession.getUser(),
        keylistId     = $this.data('invite-group_id');

    // Render confirmation modal
    var confirm_modal = asocial.helpers.render(
      'feed-modals-confirm', { name: name }
    );

    // Show confirmation modal
    asocial.helpers.showModal(confirm_modal, {

      closable: false,
      classes: 'modal-alert',

      // Disable modal closing by enter key if button is disabled
      onsubmit: function(){ return true; },

      onshow: function(){

        //Proceed to confirmation
        user.confirmInviteRequest(invitationId, accept, function (confirmation) {
          user.transferKeysRequest(keylistId, invitationId, inviteeId, function(){

            asocial.helpers.hideModal();
            Router.reload();

          });
        }, function () {

          asocial.helpers.showConfirm(

            name + ' provided the wrong token.', {

            submit: 'Send new invite',
            cancel: 'Cancel invite',
            closable: false,

            onsubmit: function(){

              asocial.invite.cancelInvitationRequest(inviteLink);

              user.createInviteRequest(keylistId, email, function (inviteRequestToken) {

                asocial.helpers.showAlert(
                  "We've sent a new invitation to " + email, {
                    title: 'Invitation sent'
                });

              });

            },

            onhide: function () {
              asocial.invite.cancelInvitationRequest(inviteLink);
            }

          });


        });

      }
    });

  }

});