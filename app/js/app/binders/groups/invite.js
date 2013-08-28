Binders.add('groups', { invite: function() {

  // Accept an invitation to join a group.
  $('#main').on('click', '.invite-link[data-invite-state="1"]', function (e) {
    e.preventDefault();
    Invitation.acceptInvitationRequest($(this));
  });

} }); // Binders.add();