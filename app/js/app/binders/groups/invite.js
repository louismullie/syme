Syme.Binders.add('groups', { invite: function() {

  // Accept an invitation to join a group.
  $('#main').on('click', '.invite-link[data-invite-state="1"]', function (e) {
    e.preventDefault();
    Invitation.acceptInvitationRequest($(this));
  });
  
  // Accept an invitation to join a group.
  $('#main').on('click', '.invite-link[data-invite-state="2"]', function (e) {

    var groupId = $(this).data('invite-group_id'),
        inviterId = $(this).data('invite-inviter_id');
      
    Syme.Crypto.getKeyFingerprint(groupId, inviterId, 'invitee', null,
    
      function (fingerprint) {

        prompt('Your key fingerprint is: ', fingerprint.inviteeFingerprint);
        prompt('Inviter fingerprint is: ', fingerprint.inviterFingerprint);

      }
    
    );
    
  });

} }); // Syme.Binders.add();