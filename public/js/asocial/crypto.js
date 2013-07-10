guard('crypto', {

  batchDecrypt: function(callback, collection){

    // Default callback
    var callback = callback || function(){};

    // Default collection
    var collection = collection || $([

      // Feed elements
      '.encrypted:not(.comment-hidden)',
      '.encrypted-image:not([data-decrypted="true"])',
      '.encrypted-audio:not([data-decrypted="true"])',
      '.encrypted-video:not([data-decrypted="true"])',

      // User avatars
      '.user-avatar:not([data-decrypted="true"])'

    ].join(','));

    // Show spinner
    $('#spinner').show();

    // Initial decryption
    collection.batchDecrypt(function(elapsedTime){

      // Sync slave avatars
      $('.slave-avatar').trigger('sync');

      // Remove hidden class on posts
      $('.post').removeClass('hidden');

      // Textarea autosizing
      $('textarea.autogrow').autogrow();

      // Hide spinner
      $('#spinner').hide();

      console.log(
        'Done decrypting collection of ' + this.length +
        ' items in ' + elapsedTime/1000 + 's', $(this)
      );

      callback.call(this);

    });

  },

  getFile: function (id, keys, callback, group) {

    var display = function(id, blob, save) {

      if (save) {

        var reader = new FileReader();

        reader.onload = function(event){
          var base64 = event.target.result;
          store.save({ key: id, value: base64 });
        };

        reader.readAsDataURL(blob);

      }

      var url = URL.createObjectURL(blob);

      callback(url);

    };

    var download = function (id, keys, group) {

      var group = group || CurrentSession.getGroupId();
      var baseUrl = SERVER_URL + '/' + group + '/file/';

      var downloader = new Downloader(id, keys, {
        baseUrl: baseUrl, group: group });

      downloader.start(
        function() {},
        function(blob) {
          display(id, blob, true);
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

          if (typeof(me) == "undefined") {

            download(id, keys, group);

          } else {

            // Replace this eventually
            var blob = ThumbPick.prototype.dataURItoBlob(me.value);

            display(id, blob, false);

          }
        });

    });

  }

});