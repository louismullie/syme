var Invitation = Backbone.Model.extend({

  idAttribute: "id",
  url: SERVER_URL + '/invitations'

}, {

  // Parse emails and invite them all
  createInvitationRequest: function(emails, callback) {

    var user    = Syme.CurrentSession.getUser(),
        groupId = Syme.CurrentSession.getGroupId();

    user.createInviteRequests(groupId, emails, callback);

  },

  acceptInvitationRequest: function (inviteLink) {

    var user = Syme.CurrentSession.getUser();

    var invitationId = inviteLink.data('invite-id');
    var groupId = inviteLink.data('invite-group_id');
    var request = inviteLink.data('invite-request');
    var inviterName = inviteLink.data('invite-inviter_name');
    var message = 'Enter the key ' + inviterName + ' has sent you:';

    user.acceptInviteRequest(invitationId, request, function () {
      Notifications.fetch();
      Syme.Router.reload();
      $('.popover').hide();
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
      'feed-modals-confirm', { name: name }
    );

    // Show confirmation modal
    Modal.show(confirm_modal, {

      closable: false,
      classes: 'modal-alert',

      // Disable modal closing by enter key if button is disabled
      onsubmit: function(){ return true; },

      onshow: function(){

        //Proceed to confirmation
        user.confirmInviteRequest(keylistId, invitationId, inviteeId, accept, function () {

          Modal.hide();
          Syme.Router.reload();

        }, function () {

          Confirm.show(

            name + ' entered the wrong key.', {
            title: 'Wrong key',
            submit: 'Send a new invite',
            cancel: 'Cancel invite',
            closable: false,

            onsubmit: function(){

              Invitation.cancelInvitationRequest(inviteLink);

              user.createInviteRequests(keylistId, [email], function (inviteInfos) {

                Alert.show(
                  "You've sent a new invitation to <b>" + email + "</b>.", {
                    title: 'Invitation sent',
                    onsubmit: function () {
                      Syme.Router.reload();
                    }
                });

              });

            },

            onhide: function () {

              Invitation.cancelInvitationRequest(inviteLink);

            }

          });


        });

      }
    });

  }

});