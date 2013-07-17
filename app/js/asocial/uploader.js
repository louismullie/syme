guard('uploader', {

  upload: function(file, data, progress, success) {

    progress = progress || function () {};
    success = success || function () {};

    var group = CurrentSession.getGroupId();

    if (file.size / 1024 > 1024 * 25) {

      asocial.helpers.showAlert(
        'You can only upload files of up to 25 Mb for now.');

      asocial.helpers.resetFeedForm();

      return false;

    } else {

      uploader = new Uploader(file, {
        data: data, baseUrl: SERVER_URL + '/' + group + '/file/'
      });

      uploader.start(progress, success);

      return true;

    }

  },

  uploadTransfer: function (file, transfer_id) {

    this.upload(

      file, { transfer_id: transfer_id },

      function (progress) { },

      function (upload) {
        var params = $.param({
          transfer_id: transfer_id,
          group_id: CurrentSession.getGroupId()
        });

        $.post(SERVER_URL + '/send/file/start', params);
      }

    );
  },

  uploadFile: function (file, progress, success) {
    this.upload(file, {}, progress, function(upload_id) {
      success(upload_id);
    });
  },

  uploadImage: function (file, progress, success) {

    var img = document.createElement('img');

    var _this = this;

    img.onload = function () {

      var _that = this;

      var callback = function (compressed) {

        var size = _that.width.toString() + 'x' +
                   _that.height.toString();

        compressed.name = file.name;
        compressed.type = file.type;
        compressed.size = file.size;

        _this.upload(

          compressed, { image_size: size }, progress,

          function(upload_id) {

            _this.uploadThumbnail(file, upload_id);

            success(upload_id);

          }

        );

      };

      var options = { image: this, mime: file.type };

      var compressor = new ThumbPick('#canvas');

      compressor.compress({ image: this, mime: file.type }, callback);

    };

    img.onerror = function () {
      _this.reset();
      asocial.socket.create.error(
        { message: 'Corrupt image file.' }
      );
    };

    img.src = URL.createObjectURL(file);

  },

  uploadThumbnail: function (file, uploadId) {

    var url = URL.createObjectURL(file);
    var img = document.createElement('img');
    var _this = this;

    img.onload = function () {

      var callback = function (image) {

        var data = {
          mode: 'thumbnail',
          upload_id: uploadId
        };

        _this.upload(image, data);

      };

      var thumbnailer = new ThumbPick('#canvas');

      thumbnailer.thumbnail({
        image: this, mime: file.type,
        width: 680, height: 500,
        compression: 0.6
      }, callback);

    };

    img.src = url;

  },

  hasImageMime: function (file) {

    return file.type.indexOf("image") !== -1;

  },

  selectFile: function (file, type) {

    // What to do otherwise?
    if (!(file instanceof File)) {
      file = $('#upload_file')[0].files[0];
    }

    // Get elements
    var container = $('#upload-box'),
        box       = container.find('.upload-row');

    // Progress function
    var progress = function(number) {
      box.css('background-size', number + '%');
    };

    // Success function
    var success = function(upload_id){
      // Change box style
      box.addClass('done');

      // Set upload id
      $('#upload_id').val(upload_id);

      // Remove active state from container
      container.removeClass('active');
    };

    // Show upload box and mark it as active
    container.show().addClass('active');

    // Reset box (as long as upload is single-file)
    box.css('background-size', '0%').removeClass('done');

    /* Eventually create rows. For now, as upload is a single-file
       upload, only fill the existent static DOM */

    // Fill filename
    box.find('span.filename').text( file.name );

    // Fill filesize
    box.find('span.filesize').text(
      asocial.helpers.formatSize(file.size)
    );

    // Delete/cancel upload event
    box.find('a.delete-upload').one('click', function(){
      // Delete upload_id
      $('#upload_id').val('');

      // Hide container
      container.hide();

      // Single: show attachments again
      $('ul#attachments').show();
    });

    // Hide attachments
    $('ul#attachments').hide();

    // Upload file
    if (asocial.uploader.hasImageMime(file)) {
      asocial.uploader.uploadImage(file, progress, success);
    } else {
      asocial.uploader.uploadFile(file, progress, success);
    }

  },

  selectAvatar: function (file, thumbnailCallback, uploadCallback) {

    if (!asocial.uploader.hasImageMime(file)) {
      asocial.helpers.showAlert('This is not an image!');
      return false;
    }

    this.uploadAvatar(file, function(url){

      // Return thumbnail image data-url
      thumbnailCallback(url);

    }, uploadCallback);

  },

  selectGroupAvatar: function (file, thumbnailCallback, uploadCallback) {

    if (!asocial.uploader.hasImageMime(file)) {
      asocial.helpers.showAlert('This is not an image!');
      return false;
    }

    this.uploadGroupAvatar(file, function(url){

      // Return thumbnail image data-url
      thumbnailCallback(url);

    }, uploadCallback);

  },

  uploadGroupAvatar: function (file, thumbnailCallback, uploadCallback) {

    var img = document.createElement('img');
    var _this = this;

    img.onload = function () {

      var thumbnailer = new ThumbPick('#canvas');

      thumbnailer.thumbnail(

        { image: this,
          mime: file.type,
          width: 700,
          height: 700
        },

        // Blob callback: upload image
        function (image) {

          var data = {
            mode: 'group_avatar',
            image_size: '700x700'
          };

          _this.upload(image, data, function () {}, uploadCallback);

        },

        // Url callback: pass thumbnail data url to caller function
        function(url){ thumbnailCallback(url); }

      );

    };

    img.src = URL.createObjectURL(file);

  },

  uploadAvatar: function (file, thumbnailCallback, uploadCallback) {

    img = document.createElement('img');
    var _this = this;


    img.onload = function () {

      var thumbnailer = new ThumbPick('#canvas');

      thumbnailer.thumbnail(

        {
          image: this,
          mime: file.type,
          width: 150,
          height: 150
        },

        // Blob callback: upload image
        function (image) {

          var data = {
            mode: 'avatar',
            image_size: '150x150'
          };

          _this.upload(image, data, function () {}, uploadCallback);

        },

        // Url callback: pass thumbnail data url to caller function
        function(url){ thumbnailCallback(url); }

      );

    };

    img.src = URL.createObjectURL(file);

  },

  reset: function () {
    $('.textarea-supplement-info').show();
    $('.textarea-supplement-file').addClass('hidden');
  }

});