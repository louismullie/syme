asocial.binders.add('groups', { invite: function() {

  // Accept an invitation to join a group.
  $('#main').on('click', '.invite-link[data-invite-state="1"]', function (e) {
    e.preventDefault();
    asocial.invite.acceptInvitationRequest($(this));
  });

} }); // asocial.binders.add();