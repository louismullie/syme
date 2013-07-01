guard('crypto', {

  decrypt: function () {

    this.decryptAvatars();
    this.decryptPostsAndComments();
    this.decryptMedia();

  },

  decryptPostsAndComments: function() {

      var _this = this;

      // Decrypt each encrypted post on the page.

      $('.encrypted').each(function() {

        var $this = $(this);

        var post    = $this.closest('.post'),
            groupId = CurrentSession.getGroupId();

        Crypto.decryptMessage(groupId, $this.text(), function (decryptedMessage) {

          // Show the user tags.

          //var formattedMessage = asocial.helpers.replaceUserMentions(marked(decryptedMessage));

          // Markdown the message
          var formattedMessage = marked(decryptedMessage);

          $this
            // Transform the .encrypted into .collapsable
            .removeClass('encrypted')
            .addClass('collapsable')

            // Insert the markdown'd decrypted message
            .html(formattedMessage);

          post.removeClass('hidden');

          asocial.helpers.formatPostsAndComments();

        });

      });

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

  decryptAvatars: function() {

    var _this = this;

    $.each($('.user-avatar'), function (index, element) {

      var element = $(element);
      var user_id = $(this).parent().attr('id');

      var id = element.data('id');
      if (id == '') { return; }

      var keys = element.data('keys');

      _this.getFile(id, keys, function (url) {
        var avatars = $('.encrypted-avatar[data-user-id="' + user_id + '"]');
        $.each(avatars, function (index, element) { element.src = url; });
      });

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

  },

  generateRandomHexSalt: function (words) {
    var words = words || 4;
    return sjcl.codec.hex.fromBits(sjcl.random.randomWords(words,0));
  },

  encode: function (json) {
    return $.base64.encode(JSON.stringify(json));
  },

  decode: function (base64) {
    return JSON.parse($.base64.decode(base64));
  },

  ecc: {

    generateKeys: function () {
      return sjcl.ecc.elGamal.generateKeys(384, 1);
    },

    serializePublicKey: function (publicKey) {
      return publicKey.serialize();
    },

    serializePrivateKey: function (privateKey) {
      return privateKey.serialize();
    },

    buildPublicKey: function (pubJson) {

      var point = sjcl.ecc.curves["c" + pubJson.curve].fromBits(pubJson.point);

      var publicKey = new sjcl.ecc.elGamal.publicKey(pubJson.curve, point.curve, point);

      return publicKey;
    },

    buildPrivateKey: function (privJson) {

      var exponent = sjcl.bn.fromBits(privJson.exponent);

      var curve = "c" + privJson.curve;
      var privateKey = new sjcl.ecc.elGamal.secretKey(
          privJson.curve, sjcl.ecc.curves[curve], exponent);

      return privateKey;
    },

    encrypt: function (publicKey, data) {

      var symKey = publicKey.kem(0);
      var ciphertext = sjcl.encrypt(symKey.key, data);

      var message = JSON.stringify({
        'ciphertext': ciphertext,
        'encrypted_key': symKey.tag
      });

      return $.base64.encode(message);
    },

    decrypt: function (privateKey, message) {

      var cipherMessage = JSON.parse($.base64.decode(message));

      var symKey = privateKey.unkem(cipherMessage.encrypted_key);
      var decryptedData = sjcl.decrypt(symKey, cipherMessage.ciphertext);

      return decryptedData;

    }

  }

});