Syme.Binders.add('feed', { invite: function() {

  // Confirm user
  $('#main').on('click', '.invite-confirm', function(e) {

    var $this = $(this);

    var groupId = $(this).data('invite-group_id'),
        inviteeId = $(this).data('invite-email');

    // Temporary fix...
    var acceptInviteRequest = JSON.parse(
      $.base64.decode($(this).data('invite-accept')));

    var inviteePublicKey = acceptInviteRequest.inviteePublicKey;
    // End temporary fix

    Syme.Crypto.getKeyFingerprint(groupId, inviteeId, 'inviter', inviteePublicKey,

      function (fingerprints) {

      Confirm.show(

        Syme.Template.render('feed-modals-invite-confirm', fingerprints),

        {
          closable: true,
          title: 'Confirm invitation',
          submit: 'Confirm',
          cancel: 'Cancel',

          onsubmit: function() {

            Invitation.confirmInvitationRequest($this);

          }

        }
      );

    });

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

        $.fn.binders.batchinviter.main();

        // Bind form action directly, to avoid event persistance
        $('#responsive-modal a.modal-button').bind('click', function(e){

          e.preventDefault();

          // Get e-mails from batch inviter
          var emails = $('#batchinvite span.tag[data-mail]').map(function(){
            return $(this).attr('data-mail');
          }).get();

          // Prevent submitting if no email
          if(!emails.length) return false;

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
              Modal.hide();
              Syme.Router.reload();
          });

        });

      }

    });

  });

} }); // Syme.Binders.add();