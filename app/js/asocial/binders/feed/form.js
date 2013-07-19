asocial.binders.add('feed', { form: function(){

  // Form feed textarea autosizing
  $('#feed-form textarea').autogrow();

  /* AJAX for feed form */
  $('#main').on('submit', '#feed-form', function(e){

    e.preventDefault();

    var $this = $(this);

    // Get the message from the textarea.
    var message = $this.find('textarea').val()
                  .replace('#', '\\#');
    // Allow hashtags despite markdown by escaping #

    // If a file is uploading, indicate to wait
    if( $('#upload-box').hasClass('active') ) {

      // If indication already exists, return
      if( $this.find('.validation-container').length ) return;

      $this.find('#textarea-holder').after(
        '<div class="validation-container">' +
          '<div class="validation-message no-arrow">' +
            'Please wait for your files to finish uploading ' +
            'before posting' +
          '</div>' +
        '</div>'
      );

      // Auto hide indication
      setTimeout(function(){

        var container = $this.find('.validation-container');

        // Hide indication
        container.transition({ opacity: 0 }, 200);
        // Then remove it
        setTimeout(function(){ container.remove(); }, 200);

      }, 3 * 1000);

    }

    // If there isn't a post or uploaded file, don't submit the form
    if(!message.trim() && !$('#upload_id').val()) return;

    // Lock event
    if($this.data('active')) return false;
    $this.data('active', true);

    // Encrypt the message and write the content to the file.
    var $form   = $(this),
        groupId = CurrentSession.getGroupId();

    Crypto.encryptMessage(groupId, message, function (encryptedMessage) {

      // Build request
      var request = {
        encrypted_content: encryptedMessage,
        upload_id: $form.find('input[name="upload_id"]').val(),
        mentioned_users: asocial.helpers.findUserMentions(message, groupId)
      };

      var userId = CurrentSession.getUserId();
      
      var url = SERVER_URL + '/users/' + userId +
                '/groups/' + groupId + '/posts';

      $.ajax(url, {
        
        type: 'POST',
        
        data: request,
        
        success: function(post){
          console.log(post);
          asocial.helpers.resetFeedForm();
          asocial.socket.create.post({ view: post });
        },
        
        error: function (post) {
          asocial.helpers.showAlert('Posting failed');
        }
        
      });

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
    $('#upload_avatar').click();

  });

  // Avatar changing
  $('#upload_avatar').on('change', function() {

    // Get filename
    var filename = asocial.helpers.getFilename($(this).val());

    // Return if filename is blank
    if (filename == "") return;

    var trigger = $('#feed-form-avatar');

    trigger
      // Lock trigger
      .data('active', true)
      // Show spinner
      .addClass('active');

    var removeActive = function() {
      trigger
        // Unlock trigger
        .data('active', false)
        // Remove spinner
        .removeClass('active');

      // Remove potential placeholder
      $('#feed-form-avatar').removeAttr('data-placeholder');
    };

    // Thumbnail and upload avatar
    var started = asocial.uploader.selectAvatar(
      // Filename
      $(this)[0].files[0],

      // Thumnail callback
      function(url) {
        $('img.user-avatar[data-user-id="' + CurrentSession.getUserId() + '"]')
          .attr('src', url);

        $('.slave-avatar[data-user-id="' + CurrentSession.getUserId() + '"]').trigger('sync');
      },

      // Success callback
      removeActive
    );

    if(!started) removeActive();

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