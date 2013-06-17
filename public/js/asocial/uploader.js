guard('uploader', {

  upload: function(file, data, progress, success) {

    var key = asocial.crypto.generateRandomKey();
    var keys = asocial.crypto.generateMessageKeys(key);

    progress = progress || function () {};
    success = success || function () {};

    var group = asocial.binders.getCurrentGroup();

    uploader = new Uploader(file, key, keys, {
      data: data, baseUrl: '/' + group + '/file/'
    });

    uploader.start(progress, success);

  },

  uploadTransfer: function (file, transfer_id) {

    this.upload(

      file, { transfer_id: transfer_id },

      function (progress) { },

      function (upload) {
        var params = $.param({
          transfer_id: transfer_id,
          group_id: asocial.binders.getCurrentGroup()
        });

        $.post('/send/file/start', params);
      }

    );
  },

  uploadFile: function (file, progress, success) {
    this.upload(file, {}, progress, success);
  },

  uploadImage: function (file, progress) {

    var img = new Image();

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

            $('#upload_id').val(upload_id);

          }

        );

      };

      asocial.thumbnail.make(this, file.type, this.width, this.height, callback);

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
    var img = new Image();
    var _this = this;

    img.onload = function () {

      var callback = function (image) {

        var data = {
          mode: 'thumbnail',
          upload_id: uploadId
        };

        _this.upload(image, data);

      }

      var thumbnail = asocial.thumbnail.make(
        this, file.type, 680, 500, callback);

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

    // Show upload box
    container.show();

    // Reset box (as long as upload is single-file)
    box.find('span.icon').show();

    /* Eventually create rows. For now, as upload is a single-file
       upload, only fill the existent static DOM */

    // Fill filename
    box.find('span.filename').text( file.name );

    // Fill filesize
    box.find('span.filesize').text(
      asocial.helpers.formatSize(file.size)
    );

    // Progress function
    var progress = function(number) {
      box.css('background-size', number.toString() + '%');
    };

    // Success function
    var success = function(){
      box
        // Remove progress bar
        .css('background-size', '0%')

        // Remove spinner
        .find('span.icon').hide();
    };

    if (asocial.uploader.hasImageMime(file)) {
      asocial.uploader.uploadImage(file, progress, success);
    } else {
      asocial.uploader.uploadFile(file, progress, success);
    }

  },

  selectAvatar: function (file, type) {

    if (!asocial.uploader.hasImageMime(file)) {
      asocial.helpers.showAlert('This is not an image!');
    } else {
      this.uploadAvatar(file);
    }

  },

  selectGroupAvatar: function (file) {

    if (!asocial.uploader.hasImageMime(file)) {
      asocial.helpers.showAlert('This is not an image!');
    } else {
      this.uploadGroupAvatar(file);
    }

  },

  uploadGroupAvatar: function (file) {

    var img = new Image();
    var _this = this;

    img.onload = function () {

      asocial.thumbnail.make(

        this, file.type, 700, 700, function (image) {

          var data = {
            mode: 'group_avatar',
            image_size: '700x700'
          };

          _this.upload(image, data, function () {}, function () {
            asocial.binders.loadCurrentUrl();
          });

      });

    };

    img.src = URL.createObjectURL(file);

  },

  uploadAvatar: function (file) {

    img = new Image();
    var _this = this;


    img.onload = function () {

      asocial.thumbnail.make(

        this, file.type, 150, 150, function (image) {

          var data = {
            mode: 'avatar',
            image_size: '150x150'
          };

          _this.upload(image, data, function () {},  function () {
            asocial.binders.loadCurrentUrl();
          }, 'allo');

      });

    };

    img.src = URL.createObjectURL(file);

  },

  reset: function () {
    $('.textarea-supplement-info').show();
    $('.textarea-supplement-file').addClass('hidden');
  }

});