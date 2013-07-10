asocial.binders.add('groups', { invite: function() {

  // Accept an invitation to join a group.
  $('.invite-link[data-invite-state="1"]').on('click', function (e) {
    asocial.invite.acceptInvitationRequest($(this));
  });

} }); // asocial.binders.add();