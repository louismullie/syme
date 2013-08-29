FileManager = {

  getFile: function (id, keys, callback, group) {

    var display = function(id, blob, keys, save) {

      if (save) {
        
        Syme.Crypto.decryptMessage(group, keys, function (key) {
          
          var reader = new FileReader();

          reader.onload = function(event){
            
            var base64 = sjcl.encrypt(key, event.target.result);
            
            store.save({ key: id, value: {
              groupId: group, content: base64 }});
              
          };
        
          reader.readAsDataURL(blob);

        });

      }

      var url = URL.createObjectURL(blob);

      callback(url);

    };

    var download = function (id, keys, group) {

      var group = group || Syme.CurrentSession.getGroupId();
      var baseUrl = SERVER_URL + '/' + group + '/file/';
      var csrfToken = Syme.CurrentSession.getCsrfToken();
      
      var downloader = new Downloader(id, keys, {
        baseUrl: baseUrl, group: group, csrfToken: csrfToken });

      downloader.start(
        function() {},
        function(blob) {
          display(id, blob, keys, true);
        }, function () {
          callback(false)
        });
      

    };

    var store = new Lawnchair(

      {
        adapter: 'indexed-db',
        name: 'asocial' //,
        //storage: 'PERSISTENT'
      },

      function(store) {

        store.get(id, function(me) {

          if (typeof(me) == "undefined" || !me.value.groupId) {

            download(id, keys, group);

          } else {

            var data = me.value;
            
            Syme.Crypto.decryptMessage(data.groupId,  keys, function (key) {
              
              var decrypted = sjcl.decrypt(key, data.content);
              var blob = ThumbPick.prototype.dataURItoBlob(decrypted);
              
              display(id, blob, false);

            });
            
          }
          
        });

    });

  },
  
  upload: function(file, data, progress, success) {

    var progress = progress || function () {};
    var success = success || function () {};

    var group = Syme.CurrentSession.getGroupId();

    if (file.size / 1024 > 1024 * 25) {

      Alert.show(
        Syme.Messages.file.maxSize);
      
      Syme.Helpers.resetFeedForm();

      return false;

    } else {

      var baseUrl = SERVER_URL + '/' + group + '/file/';
      var csrfToken = Syme.CurrentSession.getCsrfToken();
      
      var uploadOptions = {
        data: data, baseUrl: baseUrl,
        csrfToken: csrfToken
      };

      var uploader = new Uploader(file, uploadOptions);

      uploader.start(progress, success);

      return true;

    }

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
      _this.reset(); alert('Corrupt image file.');
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
      
      $('#upload_file').val('');
      
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
      FileManager.formatSize(file.size)
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
    if (FileManager.hasImageMime(file)) {
      FileManager.uploadImage(file, progress, success);
    } else {
      FileManager.uploadFile(file, progress, success);
    }

  },

  selectAvatar: function (file, thumbnailCallback, uploadCallback) {

    if (!FileManager.hasImageMime(file)) {
      Alert.show('This is not an image!');
      return false;
    }

    this.uploadAvatar(file, function(url){

      // Return thumbnail image data-url
      thumbnailCallback(url);

    }, uploadCallback);

  },

  selectGroupAvatar: function (file, thumbnailCallback, uploadCallback) {

    if (!FileManager.hasImageMime(file)) {
      Alert.show('This is not an image!');
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
  },
  
  
  getFile: function (id, keys, callback, group) {

    var display = function(id, blob, keys, save) {

      if (save) {
        
        Syme.Crypto.decryptMessage(group, keys, function (key) {
          
          var reader = new FileReader();

          reader.onload = function(event){
            
            var base64 = sjcl.encrypt(key, event.target.result);
            
            store.save({ key: id, value: {
              groupId: group, content: base64 }});
              
          };
        
          reader.readAsDataURL(blob);

        });

      }

      var url = URL.createObjectURL(blob);

      callback(url);

    };

    var download = function (id, keys, group) {

      var group = group || Syme.CurrentSession.getGroupId();
      var baseUrl = SERVER_URL + '/' + group + '/file/';
      var csrfToken = Syme.CurrentSession.getCsrfToken();
      
      var downloader = new Downloader(id, keys, {
        baseUrl: baseUrl, group: group, csrfToken: csrfToken });

      downloader.start(
        function() {},
        function(blob) {
          display(id, blob, keys, true);
        }, function () {
          callback(false)
        });
      

    };

    var store = new Lawnchair(

      {
        adapter: 'indexed-db',
        name: 'asocial' //,
        //storage: 'PERSISTENT'
      },

      function(store) {

        store.get(id, function(me) {

          if (typeof(me) == "undefined" || !me.value.groupId) {

            download(id, keys, group);

          } else {

            var data = me.value;
            
            Syme.Crypto.decryptMessage(data.groupId,  keys, function (key) {
              
              var decrypted = sjcl.decrypt(key, data.content);
              var blob = ThumbPick.prototype.dataURItoBlob(decrypted);
              
              display(id, blob, false);

            });
            
          }
          
        });

    });

  },
  
  formatSize: function (bytes, precision) {
    
    precision = precision || 2;
    var kilobyte = 1024;
    var megabyte = kilobyte * 1024;
    var gigabyte = megabyte * 1024;
    var terabyte = gigabyte * 1024;

    if ((bytes >= 0) && (bytes < kilobyte)) {
      return bytes + ' B';

    } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
      return (bytes / kilobyte).toFixed(precision) + ' KB';

    } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
      return (bytes / megabyte).toFixed(precision) + ' MB';

    } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
      return (bytes / gigabyte).toFixed(precision) + ' GB';

    } else if (bytes >= terabyte) {
      return (bytes / terabyte).toFixed(precision) + ' TB';

    } else {
      return bytes + ' B';
    }
  },
  
  getFilename: function(fakepath) {
    var filename = fakepath;
    var lastIndex = filename.lastIndexOf("\\");
    if(lastIndex >= 0) {
      filename = filename.substring(lastIndex + 1);
    }
    return filename;
  }

};