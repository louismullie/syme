Syme.FileManager = function (databaseName, initializedCb) {

  this.databaseName = databaseName;
  
  this.adapterType = 'indexed-db';
  
  this.store = null;

};

Syme.FileManager.prototype = {

  /*
   * Initialize the file manager by creating
   * a Lawnchair instance and connecting to
   * the local database.
   */
  initialize: function (initializedCb) {

    var _this = this;

    // Options for the store
    var options = {
      adapter: this.adapterType,
      name: this.databaseName
    };

    // Initialize the store
    var callback = function(store) {
      _this.store = store;
      initializedCb();
    };

    // Create a new Lawnchair instance
    new Lawnchair(options, callback);

  },

  /*
   * Build a JSON object containing the ID of the file,
   * the ID of the group, and the decryption keys for the user.
   */
  buildFileInfo: function (fileId, groupId, decryptionKeys) {

    return {
      fileId: fileId, groupId: groupId,
      decryptionKeys: decryptionKeys
    };

  },

  /*
   * Retrieve the file with the given file info.
   *
   * Searches in cache, then local database, then
   * on remote server and returns a blob URL to
   * the locally decrypted file.
   */
  getFile: function (fileInfo, gotFileCb) {

    var _this = this;

    // Create local variables from file info
    var fileId = fileInfo.fileId,
        groupId = fileInfo.groupId,
        decryptionKeys = fileInfo.decryptionKeys;

    // Get the file from database or remote server
    var retrieveFile = function () {
      _this.retrieveFile(fileInfo, function (fileUrl) {
        
        // Pass file URL to callback
        gotFileCb(fileUrl);

        // Store the file URL in the cache
        Syme.Cache.store(fileId, fileUrl);

      });
    };
    
    // Verify if the file already exists in the cache
    if (Syme.Cache.contains(fileId)) {

      try { 
        // Pass file URL to callback
        gotFileCb(Syme.Cache.get(fileId));
      } catch (e) {
        retrieveFile();
      }

    // If the file is not cached, get it elsewhere
    } else {

      retrieveFile();

    }

  },

  /*
   * Retrieve the file with the given info.
   *
   * Searches first in the local storage, then
   * on the remote server. Returns the blob URL
   * to the locally decrypted file.
   */
  retrieveFile: function (fileInfo, gotFileCb) {

    var _this = this;

    // Create local variables from file info
    var fileId = fileInfo.fileId,
        groupId = fileInfo.groupId,
        decryptionKeys = fileInfo.decryptionKeys;

    // Attempt to retrieve the file from the database store.
    this.store.get(fileId, function(record) {
  
      // If the record does not exist, download and locally store file
      if (typeof(record) == 'undefined') { //  || record == null

        _this.downloadFile(fileInfo, gotFileCb);

      // If the record already exists, just decrypt the file
      } else {

        var file = record.value;
        
        if (!file.groupId || !file.key || !file.content || !file.type) {
          
          _this.downloadFile(fileInfo, gotFileCb);
          
        } else {  
          
          // Decrypt the file with the supplied info
          _this.decryptFile(fileInfo.fileId, fileInfo.groupId, file.type,
            fileInfo.decryptionKeys, file.content, gotFileCb);

        }
        
      }

    });

  },

  saveFile: function (fileId, groupId, mimeType, key, content) {
    
    this.store.save({ key: fileId, value: {
      groupId: groupId, key: key,
      content: content, type: mimeType
    } });

  },

  /*
   * Retrieves the file matching the supplied info
   * on the server, locally decrypts it and passes
   * the blob URL to the locally decrypted file to
   * the callback.
   */
  downloadFile: function (fileInfo, downloadedFileCb) {

    var _this = this;

    // Create local variables from file info
    var fileId = fileInfo.fileId,
        groupId = fileInfo.groupId,
        decryptionKeys = fileInfo.decryptionKeys;

    var groupId = groupId || Syme.CurrentSession.getGroupId();

    var baseUrl = SERVER_URL + '/' + groupId + '/file/';
    var csrfToken = Syme.CurrentSession.getCsrfToken();

    var downloader = new Downloader(fileId, decryptionKeys, {
      baseUrl: baseUrl, group: groupId, csrfToken: csrfToken,
      token: JSON.stringify({
        user_id: Syme.CurrentSession.getUserId(),
        access_token: Syme.CurrentSession.getAccessToken()
      }) });

    downloader.start($.noop,

      // Success
      function(blob, firstChunk) {
        
        var url = URL.createObjectURL(blob);

        downloadedFileCb(url);

        _this.saveFile(fileId, groupId, blob.type, decryptionKeys, firstChunk);

      },

      // Error
      function () {
        downloadedFileCb(false);
      }

    );

  },
  
  decryptFile: function (fileId, groupId, mimeType, decryptionKeys, encryptedFile, decryptedFileCb) {

    // Decrypt message keys
    Syme.Crypto.decryptMessage(groupId, decryptionKeys, function (key) {

      // Decrypt message
      Syme.Crypto.decrypt(key, encryptedFile, function (plainChunk) {
        
        var byteString = atob(atob(
          plainChunk.split(',')[1]));

        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);

        for (var i = 0; i < byteString.length; i++) {
           ia[i] = byteString.charCodeAt(i);
        }
        
        // Create blob from base 64
        var blob = new Blob([ia], { type: mimeType });
        
        var url = URL.createObjectURL(blob);

        // Return ID and blod.
        decryptedFileCb(url);

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

        
      var $form = $('#feed-form');
      $form.find('#upload_id').val('');
      $form.find('#upload-box').removeClass('active').hide();
      $form.find('ul#attachments').show();

      return false;

    } else {

      var baseUrl = SERVER_URL + '/' + group + '/file/';
      var csrfToken = Syme.CurrentSession.getCsrfToken();

      var uploadOptions = {
        data: data, baseUrl: baseUrl,
        csrfToken: csrfToken,
        token: JSON.stringify({
          user_id: Syme.CurrentSession.getUserId(),
          access_token: Syme.CurrentSession.getAccessToken()
        })
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

            _this.uploadThumbnail(file, upload_id, function () {
              success(upload_id);
            });

          }

        );

      };

      var options = { image: this, mime: file.type };

      var compressor = new ThumbPick('#canvas');

      compressor.compress({ image: this, mime: file.type, compression: 0.6 }, callback);

    };

    img.onerror = function () {
      _this.reset(); alert('Corrupt image file.');
    };

    img.src = URL.createObjectURL(file);

  },

  uploadThumbnail: function (file, uploadId, success) {

    var url = URL.createObjectURL(file);
    var img = document.createElement('img');
    var _this = this;

    img.onload = function () {

      var callback = function (image) {

        var data = {
          mode: 'thumbnail',
          upload_id: uploadId
        };

        _this.upload(image, data, $.noop, success);

      };

      var thumbnailer = new ThumbPick('#canvas');

      thumbnailer.thumbnail({
        image: this, mime: file.type,
        width: 680, height: 500 }, callback);

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
      Syme.FileManager.formatSize(file.size)
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
    if (Syme.FileManager.hasImageMime(file)) {
      Syme.FileManager.uploadImage(file, progress, success);
    } else {
      Syme.FileManager.uploadFile(file, progress, success);
    }

  },

  selectAvatar: function (file, thumbnailCallback, uploadCallback) {

    if (!Syme.FileManager.hasImageMime(file)) {
      Alert.show('This is not an image!');
      return false;
    }

    this.uploadAvatar(file, function(url){

      // Return thumbnail image data-url
      thumbnailCallback(url);

    }, uploadCallback);

  },

  selectGroupAvatar: function (file, thumbnailCallback, uploadCallback) {

    if (!Syme.FileManager.hasImageMime(file)) {
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
  },

  saveToDisk: function(url, filename) {
    var a = $("<a>").attr("href", url)
      .attr("download", filename).appendTo("body");
    a[0].click(); a.remove();
  },
  
  setAsBackgroundImage: function(element, url) {
    if (!Syme.Compatibility.onAppleWebKit()) {
      element.css("background-image", "url('" + url + "')");
    } else {
      this.getBlobUrlAsBase64(url, 'image/jpeg', function (base64) {
        element.css("background-image", "url('" + base64 + "')");
      });
    }

  },
  
  setAsImageSrc: function (image, url) {
    
    if (!Syme.Compatibility.onAppleWebKit()) {
      image.attr('src', url);
    } else {
      this.getBlobUrlAsBase64(url, 'image/jpeg', function (base64) {
        image.attr('src', base64);
      });
    }
    
  },
  
  getBlobUrlAsBase64: function (url, mimeType, callback) {
    
    var _this = this;
    var xhr = new XMLHttpRequest();
    
    xhr.onload = function(e) {
      
      if (this.status == 200) {
        var base64 = _this.arrayBufferToBase64(this.response);
        callback("data:" + mimeType + ";base64," + base64);
      } else {
        alert('Oops! Something went wrong.');
      }
    };
    
    xhr.onerror = function (e) {
      
      console.log(e);
      
    };
    
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.send();
    
  },
  
  arrayBufferToBase64: function(buffer) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }
 
};