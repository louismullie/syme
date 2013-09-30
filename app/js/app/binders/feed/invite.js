Syme.Binders.add('feed', { invite: function() {

  // Confirm user
  $('#main').on('click', '.invite-confirm', function(e) {
    
    var groupId = $(this).data('invite-group_id'),
        inviteeId = $(this).data('invite-email');
    
    // Temporary fix...
    var acceptInviteRequest = JSON.parse(
      $.base64.decode($(this).data('invite-accept')));
    
    var inviteePublicKey = acceptInviteRequest.inviteePublicKey;
    // End temporary fix
    
    Syme.Crypto.getKeyFingerprint(groupId, inviteeId, 'inviter', inviteePublicKey,
    
      function (fingerprint) {

      prompt('Your fingerprint is:', fingerprint.inviterFingerprint);
      prompt('Invitee fingerprint is:', fingerprint.inviteeFingerprint);
       
      if (prompt('Are you sure you want to accept?'))
        Invitation.confirmInvitationRequest($(this));
    
      }
    
    );

  });

  // Accept an invitation to join a group.
  $('#main').on('click', '.invite-delete', function (e) {
    Invitation.cancelInvitationRequest($(this));
  });

  // Add new user
  $('#main').on('click', 'a#add-user, a#add-user-first', function(){

    var content = Syme.Template.render('feed-modals-invite');

    Modal.show(content, {

      classes: 'modal-invite',

      // Specify onsubmit() to prevent normal submitting enter key
      // or submit button, and rather delegate it to the submit()
      // event specified in onshow()

      onsubmit: function() { return true; },

      onshow: function() {

        Syme.Binders.bind('batchinviter');

        // Bind form action directly, to avoid event persistance
        $('#responsive-modal a.modal-button').bind('click', function(e){

          e.preventDefault();
          
          // Get e-mails from batch inviter
          var emails = $('#batchinvite span.tag[data-mail]').map(function(){
            return $(this).attr('data-mail');
          }).get();
          
          // Prevent submitting if no email
          if(!emails) return false;
          
          // Get responsive modal form
          var $form = $('#responsive-modal form');
          
          // Lock form
          $form.data('active', true);
          
          // Add spinner
          $form.find('a.modal-button').addClass('spinner');
          
          var user    = Syme.CurrentSession.getUser(),
              groupId = Syme.CurrentSession.getGroupId();

          user.createInviteRequests(groupId, emails,
            function(){ 
              $('#responsive-modal').hide()
              Syme.Router.reload();
          });
          
        });

      }

    });

  });

} }); // Syme.Binders.add();