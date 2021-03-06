Syme.Binders.add('feed', { form: function(){

  /* Feed form */

  $('#main').on('submit', '#feed-form', function(e){

    e.preventDefault();

    var $form     = $(this),
        upload_id = $form.find('input[name="upload_id"]').val(),
        $textarea = $form.find('textarea');

    var groupId   = Syme.CurrentSession.getGroupId(),
        userId    = Syme.CurrentSession.getUserId();

    // If a file is uploading, indicate to wait and prevent posting
    if( $('#upload-box').hasClass('active') ) {

      // If indication already exists, return
      if( $form.find('.validation-container').length ) return;

      $form.find('#textarea-holder').after(
        '<div class="validation-container">' +
          '<div class="validation-message no-arrow">' +
            'Please wait for your files to finish uploading ' +
            'before posting' +
          '</div>' +
        '</div>'
      );

      // Auto hide indication
      setTimeout(function(){

        var container = $form.find('.validation-container');

        // Hide indication
        container.transition({ opacity: 0 }, 200);
        // Then remove it
        setTimeout(function(){ container.remove(); }, 200);

      }, 3 * 1000);

      return;

    }

    // If there isn't a post or uploaded file, don't submit the form
    if(!$textarea.val().trim() && !upload_id) return;

    // Lock event
    if($form.data('active')) return false;
    $form.data('active', true);

    // Begin posting once we get the async mentions.
    var postWithMentions = function(mentions_data){

      var createPostUrl = Syme.Url.fromCurrentGroup('posts');
      
      $.encryptedAjax(createPostUrl, {

        type: 'POST',

        data: {
          upload_id: upload_id,
          mentioned_users: mentions_data.mentioned_users
        },

        success: function(post){

          // Get the message with mentions markup and
          // allow hashtags despite markdown by escaping #
          var message = mentions_data.text.replace('#', '\\#');

          // Show post directly by sending the
          // unencrypted post by self-socket update
          post.content = message;
          post.encrypted = false;
          
          Syme.Socket.create.post({ view: post }, true);
          
          // Reset uploads & attachments
          $form.find('#upload_id').val('');
          $form.find('#upload-box').removeClass('active').hide();
          $form.find('ul#attachments').show();

          // Reset textarea
          $textarea.trigger('reset');
          
          //NProgress.showSpinner();
          
          Syme.Crypto.encryptMessage(groupId, message, function (encryptedMessage) {

            var updatePostUrl = Syme.Url.join(createPostUrl, post.id);
            
            $.encryptedAjax(updatePostUrl, {

              type: 'PUT',

              data: { content: encryptedMessage },

              success: function () {
                //NProgress.hideSpinner();
                $form.data('active', false);
              },

              error: function () {
                
                Alert.show(Syme.Messages.error.postingFailed);
                //NProgress.hideSpinner();
                $form.data('active', false);
              }

            });

          });

        },

        error: function (post) {
          // POST failed
          Alert.show(Syme.Messages.error.postingFailed);
        }

      });

    };

    // Get the async mentions
    $textarea.trigger('getMentionsMarkup', postWithMentions);

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
      Syme.FileManager.selectFile(file);
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
    var filename = Syme.FileManager.getFilename($(this).val());

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
    var started = Syme.FileManager.selectAvatar(
      // Filename
      $(this)[0].files[0],

      // Thumnail callback
      function(url) {
        
        var userId = Syme.CurrentSession.getUserId();
        
        var $avatar = $('img.user-avatar[data-user-id="' + userId + '"]');
        Syme.FileManager.setAsImageSrc($avatar, url);

        $('.slave-avatar[data-user-id="' + userId + '"]').trigger('sync');
        
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
  $('#upload_file').on('change', Syme.FileManager.selectFile);

} }); // Syme.Binders.add();
