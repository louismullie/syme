asocial.binders.add('feed', { form: function(){

  /* AJAX for feed form */
  $('#main').on('submit', '#feed-form', function(e){

    e.preventDefault();
    
    if($(this).data('active')) return false;
    $(this).data('active', true);

    // Get the message from the textarea.
    var message = $(this).find('textarea').val();
    // If there isn't a post or uploaded file, don't submit the form
    if(!message.trim() && !$('#upload_id').val()) return;

    // Encrypt the message and write the content to the file.
    var encrypted = asocial.crypto.encryptMessage(message);
    $('#encrypted_content').val(JSON.stringify(encrypted));

    // Get the users who were mentioned in the message.
    var mentions = asocial.helpers.findUserMentions(message);
    $('#mentioned_users').val(JSON.stringify(mentions));

    // Build request
    var request = $(this).serialize();

    var group = asocial.state.group.id;
    var url = 'http://localhost:5000/' + group + '/post/create';

    $.post(url, request, function(data){

      asocial.helpers.resetFeedForm();

    }).fail(function(){

      alert('Posting failed');
      
      // Implement error if posting failed

    });

  });

  /* Upload dropzone */

  var dropzone = '#feed-form';
  var draghelper = '#drag-helper';

  $('#main')
    .on("dragenter", dropzone, function(event){
      event.preventDefault();
      $(draghelper).show();
    })
    .on("dragover", dropzone, function(event){
      event.preventDefault();
      $(draghelper).show();
    })
    .on("dragleave", draghelper, function(event){
      event.preventDefault();
      $(draghelper).hide();
    })
    .on("drop", draghelper, function(event){
      event.preventDefault();
      $(draghelper).hide();
      var file = event.originalEvent.dataTransfer.files[0];
      asocial.uploader.selectFile(file);
    });

  // Trigger avatar changing
  $('#feed-form-avatar').click(function() {

    // Lock event
    if($(this).data('active')) return false;
    $(this).attr('data-active', true);

    $('#upload_avatar').click();

  });

  // Avatar changing
  $('#upload_avatar').on('change', function() {

    // Get filename
    var filename = asocial.helpers.getFilename($(this).val());

    // Thumbnail and upload avatar
    asocial.uploader.selectAvatar(
      // Filename
      $(this)[0].files[0],

      // Thumnail callback
      function(url) {
        // Replace thumbnail in DOM
        $('#feed-form-avatar img, img[data-user-id="' + asocial.state.user.id + '"]')
          .attr('src', url);
      },

      // Success callback
      function() {
        $('#feed-form-avatar').removeAttr('data-active');
      }
    );

  });

  /* File upload */

  // Trigger the file upload input
  $('#main').on('click', 'a[data-upload-trigger]', function(e){
    // Unused for now.
    var mode = $(this).data('upload-trigger');
    $('#upload_file').trigger('click');
  });

  // Prepare file upload when the file is changed.
  $('#upload_file').on('change', asocial.uploader.selectFile);

} }); // asocial.binders.add();