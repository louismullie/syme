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

    // Submit invite
    var user = CurrentSession.getUser();
    var groupId = CurrentSession.getGroupId();
    
    var succeededInvitations = [];
    
    user.createInviteRequests(groupId, validatedEmails, function (inviteRequests) {
      
      _.each(inviteRequests, function (inviteRequestInfo) {
        succeededInvitations.push({
          email: inviteRequestInfo.alias,
          token: inviteRequestInfo.request[1]
        });
      });
      
      callback({ succeeded: succeededInvitations, failed: failedInvitations });

    });

  },

  acceptInvitationRequest: function (inviteLink) {

    var user = CurrentSession.getUser();

    var invitationId = inviteLink.data('invite-id');
    var groupId = inviteLink.data('invite-group_id');
    var request = inviteLink.data('invite-request');

   asocial.helpers.showPrompt('Enter your invitation key', function (token) {
      
      user.acceptInviteRequest(invitationId, request, token, function () {
        Notifications.fetch();
        Router.reload();
        $('.popover').hide();
      });

    }, { title: 'Accept invitation', closable: false });

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
        user.confirmInviteRequest(keylistId, invitationId, inviteeId, accept, function () {

          asocial.helpers.hideModal();
          Router.reload();

        }, function () {

          asocial.helpers.showConfirm(
            
            name + ' entered the wrong key.', {
            title: 'Wrong key',
            submit: 'Send a new invite',
            cancel: 'Cancel invite',
            closable: false,

            onsubmit: function(){

              asocial.invite.cancelInvitationRequest(inviteLink);

              user.createInviteRequests(keylistId, [email], function (inviteInfos) {

                var token = inviteInfos[0].request[1];
                
                asocial.helpers.showAlert(
                  "You've sent a new invitation to <b>" + email + "</b>. <br />" +
                  "A new invitation key was created." +
                  "<br />The new key is: <b>" + token + "</b>.", {
                    title: 'Invitation sent',
                    onsubmit: function () {
                      Router.reload();
                    }
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