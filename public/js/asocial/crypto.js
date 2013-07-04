guard('crypto', {

  decrypt: function () {

    this.decryptMedia();

  },

  // Rename to decryptmedia.
  decryptMedia: function() {

    var _this = this;

    $.each($('.encrypted-image, .encrypted-audio, .encrypted-video'), function (index, image) {

      var image = $(image);

      var id = image.data('attachment-id');
          keys = image.data('attachment-keys'),
          type = image.data('attachment-type'),
          group = image.data('attachment-group');

      _this.getFile(id, keys, function (url) {

        if (type == 'image') {
          image.attr('src', url);
          image.removeClass('encrypted-image');
        } else if (type == 'video') {
          image.attr('src', url);
          image.removeClass('encrypted-video');
          //image.mediaelementplayer();
        } else {
          asocial.helpers.showAlert("No handler for audio!");
        }

      }, group);

    });

    $.each($('.encrypted-background-image'), function (index) {

      var $this = $(this);

      var id = $this.data('attachment-id'),
          keys = $this.data('attachment-keys'),
          group = $this.data('attachment-group');

      _this.getFile(id, keys, function (url) {

        $this.css("background-image", "url('" + url + "')");

      }, group);

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