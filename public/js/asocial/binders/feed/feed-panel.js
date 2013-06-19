asocial.binders.add('feed', { feed_panel: function(){

  // Group photo edit button action
  $('#main').on('click', '#group-photo-edit', function(e){
   $('#group-photo-file').trigger('click');
  });

  // Group photo upload
  $('#main').on('change', '#group-photo-file', function(){
    var filename = asocial.helpers.getFilename($(this).val());
    if (filename == '') { return; }

    asocial.uploader.selectGroupAvatar($(this)[0].files[0]);
  });

  // Add new user
  $('#main').on('click', 'a#add-user', function(){

    var content = asocial.helpers.render('feed-modals-invite');

    asocial.helpers.showModal(content, {

      classes: 'modal-small',

      onshow: function(){

        // Bind form action directly, to avoid event persistance
        $('#responsive-modal form').submit(function(e){

          e.preventDefault();

          var email = $(this).find('input[name="email"]').val();

          asocial.invite.inviteSubmit(email, function(data) {
            asocial.helpers.showAlert('Invitation sent.');
          });

        });

      }

    });

  });

  //$('#main').on('click', '.user-icon', function(e){
  //  var input = $(this).parent().find('.user-form input[type="file"]');
  //  var recipient_id = $(this).parent().attr('id');

  //  input.change(function (e) {
  //    $.post('/send/file', $.param({
  //      file: input.val(),
  //      // e.target.files[0]
  //      recipient_id: recipient_id,
  //      group: asocial.binders.getCurrentGroup()
  //    }));
  //  }).trigger('click');

  //});

} }); // asocial.binders.add();