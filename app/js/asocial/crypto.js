guard('crypto', {

  batchDecrypt: function(callback, collection){

    // Default callback
    var callback = callback || function(){};

    // Cleanup / fix
    if (ONE_PAGE_VIEW) {
      $.each($('.comment-hidden'), function (ind, comment) {
        $(comment).removeClass('comment-hidden');
      });
    }
    
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

    if (collection.length == 0)
      return;

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

    var display = function(id, blob, keys, save) {

      if (save) {
        
        Crypto.decryptMessage(group, keys, function (key) {
          
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

      var group = group || CurrentSession.getGroupId();
      var baseUrl = SERVER_URL + '/' + group + '/file/';

      var downloader = new Downloader(id, keys, {
        baseUrl: baseUrl, group: group });

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
            
            Crypto.decryptMessage(data.groupId,  keys, function (key) {
              
              var decrypted = sjcl.decrypt(key, data.content);
              var blob = ThumbPick.prototype.dataURItoBlob(decrypted);
              
              display(id, blob, false);

            });
            
          }
          
        });

    });

  }

});