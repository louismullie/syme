guard('crypto', {

  decryptAll: function(callback){

    var callback = callback || function(){};

    // Show spinner
    $('#spinner').show();

    // Initial decryption
    $([

      // Feed elements
      '.encrypted',
      '.encrypted-image',
      '.encrypted-audio',
      '.encrypted-video',

      // User avatars
      '.user-avatar'

    ].join(',')).batchDecrypt(function(elapsedTime){

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
        ' items in ' + elapsedTime/1000 + 's'
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
          console.log("STORING!!!");
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