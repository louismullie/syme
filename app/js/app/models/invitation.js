var Invitation = Backbone.Model.extend({

  idAttribute: "id",
  url: SERVER_URL + '/invitations'

}, {
        
  acceptInvitationRequest: function (inviteLink) {

    var user = Syme.CurrentSession.getUser();

    var invitationId = inviteLink.data('invite-id');
    var groupId = inviteLink.data('invite-group_id');
    var request = inviteLink.data('invite-request');
    var inviterName = inviteLink.data('invite-inviter_name');
    
    NProgress.showSpinner();

    user.acceptInviteRequest(invitationId, request, function () {
      Notifications.fetch();
      Syme.Cache.delete('groups');
      Syme.Router.reload();
      $('.popover').hide();
      NProgress.hideSpinner();
    });

  },

  cancelInvitationRequest: function (inviteLink) {

    var userId = Syme.CurrentSession.getUserId();
    var groupId = inviteLink.data('invite-group_id');
    var invitationId = inviteLink.data('invite-id');

    var baseUrl = Syme.Url.fromGroup(groupId);

    var cancelInvitationUrl = Syme.Url.join(
      baseUrl, 'invitations', invitationId);

    $.encryptedAjax(cancelInvitationUrl, {

      type: 'DELETE',

      success: function () {
        Notifications.fetch();
        Syme.Cache.delete('groups');
        Syme.Router.reload();
        $('.popover').hide();
      },

      // Callback when invite cancel failed.
      error: function (response) {
        Syme.Error.ajaxError(response, 'cancel', 'invitation');
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
        user          = Syme.CurrentSession.getUser(),
        keylistId     = $this.data('invite-group_id');

    // Render confirmation modal
    var confirm_modal = Syme.Template.render(
      'feed-modals-invite-confirming', { name: name }
    );
    
    
    // Show confirmation modal
    Modal.show(confirm_modal, {

      closable: false,
      classes: 'modal-alert',

      // Disable modal closing by enter key
      onsubmit: function(){ return false; },
      
      onshow: function () {
        
        //Proceed to confirmation
        user.confirmInviteRequest(keylistId, invitationId, inviteeId, accept, function () {

          Modal.hide();
          Notifications.fetch();
          Syme.Cache.delete('groups');
          Syme.Router.reload();

        });
        
      }
      
    });

  }

});