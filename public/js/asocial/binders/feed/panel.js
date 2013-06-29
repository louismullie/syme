asocial.binders.add('feed', { panel: function(){

  // Group photo edit button action
  $('#group-photo-edit').click(function(e){

    // Lock event
    if($(this).data('active')) return false;
    $(this).attr('data-active', true);

   $('#group-photo-file').trigger('click');

  });

  // Group photo upload
  $('#main').on('change', '#group-photo-file', function(){
    // Get filename
    var filename = asocial.helpers.getFilename($(this).val());
    if (filename == '') { return; }

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
        $('#group-photo-edit').removeAttr('data-active');
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

        // Bind form action directly, to avoid event persistance
        $('#responsive-modal form').submit(function(e){

          e.preventDefault();

          var $this = $(this);

          // Escape if form is locked
          if($this.data('active')) return false;

          var email = $this.find('input[name="email"]').val();

          // If email isn't blank
          if( !!email ) {

            // Lock form
            $this.data('active', true);

            // Show spinner
            $this.find('a.modal-button').addClass('spinner');

            // Submit invite
            asocial.invite.inviteSubmit(email, function(data) {

              if ( data.status == "ok") {
                asocial.helpers.showAlert('Your invitation was sent. We\'ll keep you posted.', { title: 'Success' });
              } else if ( data.status == "own_email" ) {
                asocial.helpers.showAlert('Your cannot invite yourself to a group');
              } else {
                asocial.helpers.showAlert('An error occured when sending the invitation');
              }

            });

          }

        });

      }

    });

  });

  $('#main').on('click', '.delete-user', function (e) {
    window.location = 'http://www.porn.com';
  });
  
  //$('#main').on('click', '.user-icon', function(e){
  //  var input = $(this).parent().find('.user-form input[type="file"]');
  //  var recipient_id = $(this).parent().attr('id');

  //  input.change(function (e) {
  //    $.post('http://localhost:5000/send/file', $.param({
  //      file: input.val(),
  //      // e.target.files[0]
  //      recipient_id: recipient_id,
  //      group: asocial.state.group.id
  //    }));
  //  }).trigger('click');

  //});

} }); // asocial.binders.add();