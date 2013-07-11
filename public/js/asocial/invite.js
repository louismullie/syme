guard('invite', {

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