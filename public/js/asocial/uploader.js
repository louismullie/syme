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
          group: asocial.binders.getCurrentGroup()
        });

        $.post('/send/file/start', params);
      }

    );
  },

  uploadFile: function (file, progress) {

    this.upload(

      file, {}, progress,

      function (upload_id) {
        $('#upload_id').val(upload_id);
      }
    );

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

    if (!(file instanceof File)) {
      file = $('#upload_file')[0].files[0];
    }

    var shortFilename = asocial.helpers
      .shortenString(file.name, 25);

    var formattedSize = ' (' + asocial.helpers
      .formatSize(file.size) + ')';

    $('.textarea-supplement-info').hide();
    $('.textarea-supplement-file').removeClass('hidden')
    .text(shortFilename + formattedSize);

    var progress = function(number) {
      $('#progress_bar').css('width',
        number.toString() + '%');
    };

    if (asocial.uploader.hasImageMime(file)) {
      asocial.uploader.uploadImage(file, progress);
    } else {
      asocial.uploader.uploadFile(file, progress);
    }

  },

  selectAvatar: function (file, type) {

    if (!asocial.uploader.hasImageMime(file)) {
      alert('This is not an image!');
    } else {
      this.uploadAvatar(file);
    }

  },

  selectGroupAvatar: function (file) {

    if (!asocial.uploader.hasImageMime(file)) {
      alert('This is not an image!');
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

          var colors = getColors(img),
              dominant = arrayToRgb(colors[1]),
              median = getInverseRgbColor(colors[1], colors[0]);

          var data = {
            mode: 'group_avatar',
            image_size: '700x700',

            dominant: dominant,
            first_median: median[0],
            second_median: median[1]
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