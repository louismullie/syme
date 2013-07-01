asocial.binders.add('feed', { invite: function() {

  $('.invite-confirm').click(function(e) {

    e.preventDefault();

    //sendKeys(PA, key, public_keys, answer, inviteId, id_A, k);

    var invitationId = $(this).data('invite-id');
    var inviteeId = $(this).data('invite-invitee_id');
    
    var accept = $(this).data('invite-accept');

    var user = CurrentSession.getUser();
    
    var keylistId = CurrentSession.getGroupId();
    
    user.confirmInviteRequest(invitationId, accept, function (confirmation) {
        user.transferKeysRequest(invitationId, inviteeId, function (transferedKeys) {
          asocial.helpers.showAlert(
            'You have successfully confirmed this user.',
            { title: 'Success' }
          );
        });
    });

  });

} }); // asocial.binders.add();