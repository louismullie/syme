Syme.Binders.add('feed', { invite: function() {

  // Confirm user
  $('#main').on('click', '.invite-confirm', function(e) {
    Invitation.confirmInvitationRequest($(this));
  });

  // Accept an invitation to join a group.
  $('#main').on('click', '.invite-delete', function (e) {
    Invitation.cancelInvitationRequest($(this));
  });

  $('#main').on('click', '.invite-pending', function(e) {

    var $this = $(this);

    var invitationId  = $this.data('invite-id'),
        email         = $this.data('invite-email'),
        user          = Syme.CurrentSession.getUser(),
        keylistId     = Syme.CurrentSession.getGroupId();

    Syme.Crypto.getInvitationToken(keylistId, email, function (token) {
       prompt('Invitation token for ' + email, token);
    });

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

        // When everything below goes in the batchinvite binders,
        // bind them like this:

        // Syme.Binders.bind( 'batchinviter', false );

        // Initial textarea autosizing
        $('textarea.autogrow')
          .autogrow().removeClass('autogrow');

        // Bind form action directly, to avoid event persistance
        $('#responsive-modal a.modal-button').bind('click', function(e){

          e.preventDefault();

          var $form = $('#responsive-modal form');

          // Return if event is locked
          if($form.data('active')) return false;

          var emails = $form.find('textarea[name="emails"]').val();

          // Return if textarea is blank
          if(!emails) return false;

          // Lock form
          $form.data('active', true);

          // Show spinner
          $form.find('a.modal-button').addClass('spinner');

          // Show confirmations and/or errors
          Invitation.createInvitationRequest(emails, function(log){

            // If failed is empty, remove it from log.
            if ( _.size(log.failed) == 0 ) {

              log = _.omit(log, 'failed');

            // Otherwise, translate error to message.
            } else {

              _.each(log.failed, function (value, key) {
                log.failed[key] = Syme.Messages.error.invitation[value];
              });

            }

            // Compile success template with log
            var template = Syme.Template.render('feed-modals-invite-success', log);

            // Show modal
            Alert.show(template, {
              classes: 'modal-invite',
              title: 'Invite people',
              onhide: function () {
                Syme.Router.reload();
              }
            });

          });

        });

      }

    });

  });

} }); // Syme.Binders.add();