asocial.binders.add('groups', { invite: function() {

  // Accept an invitation to join a group.
  $('.invite-link[data-invite-state="1"]').on('click', function (e) {

    var user = CurrentSession.getUser();
    
    var invitationId = $(this).data('invite-id');
    var groupId = $(this).data('invite-group_id');
    var request = $(this).data('invite-request');
    
    var token = prompt('Enter your invitation token');
    
    user.acceptInviteRequest(invitationId, request, token, function () {
      Router.reload();
    });

  });

} }); // asocial.binders.add();