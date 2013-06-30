asocial.binders.add('feed', { panel: function(){

  // Group photo edit button action
  $('#group-photo-edit').click(function(e){
    if($(this).data('active')) return;
    $('#group-photo-file').trigger('click');
  });

  // Group photo upload
  $('#main').on('change', '#group-photo-file', function(){

    var trigger = $('#group-photo-edit');

    // Get filename
    var filename = asocial.helpers.getFilename($(this).val());

    // Return if filename is blank
    if (filename == '') return;

    trigger
      // Lock trigger
      .data('active', true)
      // Show spinner
      .addClass('active');

    // Thumbnail and upload avatar
    asocial.uploader.selectGroupAvatar(
      // Filename
      $(this)[0].files[0],

      // Thumnail callback
      function(url) {
        // Replace thumbnail in DOM
        $('#group-photo-edit img').attr('src', url);
      },

      // Success callback
      function() {
        trigger
          // Unlock trigger
          .data('active', false)
          // Remove spinner
          .removeClass('active');
      }
    );

  });

  // Add new user
  $('#main').on('click', 'a#add-user', function(){

    var content = asocial.helpers.render('feed-modals-invite');

    asocial.helpers.showModal(content, {

      classes: 'modal-invite',

      // Specify onsubmit() to prevent normal submitting enter key
      // or submit button, and rather delegate it to the submit()
      // event specified in onshow()

      onsubmit: function() { },

      onshow: function() {

        // Initial textarea autosizing
        $('textarea.autogrow').autogrow().removeClass('autogrow');

        // Bind form action directly, to avoid event persistance
        $('#responsive-modal form').submit(function(e){

          e.preventDefault();

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

          var inviteEmailsFromTextarea = function(emails, callback) {

            // Validate emails and eliminate duplicates
            var validatedEmails = [];
            _emails.split("\n").each(function(email){
              if( $.ndbValidator.regexps.email.test(email) )
                validatedEmails.push(email);
            });
            validatedEmails = _validatedEmails.uniq();

            var inviteQueue = _validatedEmails.clone(),
                succeededInvitations = [],
                failedInvitations = {};

            // Send invitations to validate emails
            _validatedEmails.each(function(validatedEmail){
              asocial.invite.inviteSubmit(validatedEmail, function(data) {

                // Log success/failures
                if (data.status == "ok") {
                  succeededInvitations.push(validatedEmail);
                } else {
                  failedInvitations[validatedEmail] = data.status;
                }

                // Remove concerned email from queue
                inviteQueue = _inviteQueue.without(validatedEmail);

                // If queue is empty, callback with
                // { succeeded: [*emails], failed: {*email: reason} }
                if(inviteQueue.length == 0) callback({
                  succeeded: succeededInvitations, failed: failedInvitations
                });

              });
            });

          };

          inviteEmailsFromTextarea(emails, function(log){
            console.log(log);
          });


        });

      }

    });

  });

  $('#main').on('click', '.delete-user', function (e) {
    window.location = 'http://www.porn.com';
  });

  // $('#main').on('click', '.user-icon', function(e){
  //   var input = $(this).parent().find('.user-form input[type="file"]');
  //   var recipient_id = $(this).parent().attr('id');

  //   input.change(function (e) {
  //     $.post('http://localhost:5000/send/file', $.param({
  //       file: input.val(),
  //       // e.target.files[0]
  //       recipient_id: recipient_id,
  //       group: asocial.state.group.id
  //     }));
  //   }).trigger('click');

  // });

} }); // asocial.binders.add();