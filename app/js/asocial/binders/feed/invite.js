asocial.binders.add('feed', { invite: function() {

  // Confirm user
  $('#main').on('click', '.invite-confirm', function(e) {
    asocial.invite.confirmInvitationRequest($(this));
  });

  // Accept an invitation to join a group.
  $('#main').on('click', '.invite-delete', function (e) {
    asocial.invite.cancelInvitationRequest($(this));
  });

  $('#main').on('click', '.invite-pending', function(e) {

    var $this = $(this);

    var invitationId  = $this.data('invite-id'),
        email         = $this.data('invite-email'),
        user          = CurrentSession.getUser(),
        keylistId     = CurrentSession.getGroupId();

    Crypto.getInvitationToken(keylistId, email, function (token) {
       prompt('Invitation token for ' + email, token);
    });

  });

  // Add new user
  $('#main').on('click', 'a#add-user, a#add-user-first', function(){

    var content = asocial.helpers.render('feed-modals-invite');

    asocial.helpers.showModal(content, {

      classes: 'modal-invite',

      // Specify onsubmit() to prevent normal submitting enter key
      // or submit button, and rather delegate it to the submit()
      // event specified in onshow()

      onsubmit: function() { return true; },

      onshow: function() {

        // Initial textarea autosizing
        $('textarea.autogrow')
          .autogrow().removeClass('autogrow');
        
        // Bind form action directly, to avoid event persistance
        $('#responsive-modal form').submit(function(e){

          var $this = $(this);

          // Return if event is locked
          if($this.data('active')) return false;

          var emails = $this.find('textarea[name="emails"]').val();

          // Return if textarea is blank
          if(!emails) return false;

          // Lock form
          $this.data('active', true);

          // Show spinner
          $this.find('a.modal-button').addClass('spinner');

          // Show confirmations and/or errors
          asocial.invite.createInvitationRequest(emails, function(log){

            if ( _.size(log.failed) == 0 )
              // If failed is empty, remove it from log
              // for templating purposes
              log = _.omit(log, 'failed');

            // Compile success template with log
            template = asocial.helpers.render('feed-modals-invite-success', log);
          
            // Show modal
            asocial.helpers.showAlert(template, {
              classes: 'modal-invite', title: 'Success',
              onsubmit: function () {
                Router.reload();
              },
              onhide: function () {
                Router.reload();
              }
            });

          });

        });

      }

    });

  });

} }); // asocial.binders.add();