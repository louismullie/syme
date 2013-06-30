guard('crypto', {

  decryptKeypair: function(password) {
    
    var _this = asocial.crypto;
    
    if (typeof(asocial_private_key) !== 'undefined' &&
        typeof(asocial_public_key)  !== 'undefined')
      return true;
      
    try {
      return _this.doDecryptKeypair(password);
    } catch(e) {
      asocial.error.fatalError();
    }

  },
  
  doDecryptKeypair: function (password) {
    
    var _this = asocial.crypto;
    
    var keypairSalt  = asocial.state.user.keypair_salt;
    var keypairKey = _this.calculateHash(password, keypairSalt);

    var encKeypairTxt64 = asocial.state.user.keypair;
    
    var decKeypairJson = _this.decode64Decrypt(keypairKey, encKeypairTxt64);

    var keypairJson = $.parseJSON(decKeypairJson);

    var privateKey = _this.ecc.buildPrivateKey(keypairJson.private_key);

    var publicKey = _this.ecc.buildPublicKey(keypairJson.public_key);

    guard('private_key', function () { return privateKey; });
    guard('public_key', function () { return publicKey; });
    
    return true;

  },

  encryptKeyList: function (keylistKey, keylistJson) {
    
    var keylistTxt = JSON.stringify(keylistJson);
    return asocial.crypto.encryptEncode64(keylistKey, keylistTxt);

  },
  
  decryptKeylist: function (password) {

   var _this = asocial.crypto;
    
   try {
      return _this.doDecryptKeylist(password);
   }  catch(e) {
      asocial.error.fatalError();
      return false;
   }
    
  },
  
  doDecryptKeylist: function (password) {
    
    var _this = asocial.crypto;
    
    var encKeylistTxt64 = asocial.state.group.keylist;
    
    var encKeylistSalt  = asocial.state.group.keylist_salt;
    var encKeylistKey = _this.calculateHash(password, encKeylistSalt);
    
    var decKeylist = _this.decode64Decrypt(encKeylistKey, encKeylistTxt64);

    var keylistJson = $.parseJSON(decKeylist);

    var keylist = _this.buildKeylistFromJson(keylistJson)

    window.asocial_keylist = function() { return keylist; }
    
    return true;
    
  },
  
  buildKeylistFromJson: function (keylistJson) {
    
    var keylist = {}, _this = asocial.crypto;
    
    $.each(keylistJson, function (userId, publicKeyJson) {
      keylist[userId] = _this.ecc.buildPublicKey(publicKeyJson);
    });
    
    return keylist;
  
  },
  
  decode64Decrypt: function (key, message) {
    return sjcl.decrypt(key, $.base64.decode(message));
  },

  encryptEncode64: function (key, message) {
    return $.base64.encode(sjcl.encrypt(key, message));
  },
  
  serializeKeyList: function () {

    var public_keys = {};
    var _this = this;

    $.each(asocial_keylist(), function (id, key) {
      public_keys[id] = _this.ecc.serializePublicKey(key);
    });

    return public_keys;

  },

  userPublicKey: function(id) {
    id = id || CurrentSession.getUserId();
    return asocial_keylist()[id];
  },

  decrypt: function () {

    var _this = this;

    this.decryptAvatars();
    this.decryptPostsAndComments();
    this.decryptMedia();
    
  },

  calculateHash: function (pass, salt) {

    hash = sjcl.misc.pbkdf2(pass, salt, 2000, 256);

    return hash;

  },

  encryptMessage: function(message) {

    var msg_key = this.generateRandomKey();
    var encrypted_message = sjcl.encrypt(msg_key, message);
    var encrypted_keys = this.generateMessageKeys(msg_key);

    return {
      content: encrypted_message,
      keys: encrypted_keys
    };

  },

  generateRandomKey: function () {

    var randWords = sjcl.random.randomWords(2, 0);
    var randHex = sjcl.codec.hex.fromBits(randWords);
    
    var randHexHash = new sjcl.hash.sha256.hash(randHex);
    var randKey = sjcl.codec.hex.fromBits(randHexHash);
    
    return randKey;

  },

  generateMessageKeys: function (msg_key) {

    var public_keys = asocial_keylist();
    var encrypted_keys = {}, _this = asocial.crypto;

    $.each(public_keys, function (user_id, public_key) {
      encrypted_keys[user_id] = _this.ecc.encrypt(public_key, msg_key);
    });

    return encrypted_keys;

  },

  generateEncryptedKeyPair: function (hash) {
    
    return this.encryptKeyPair(hash, this.generateKeypair());
    
  },

  generateKeypair: function () {

    var key = this.ecc.generateKeys();
    var _this = asocial.crypto;
    
    var privateKeyJsonTxt = _this.ecc.serializePrivateKey(key.sec);
    var publicKeyJsonTxt = _this.ecc.serializePublicKey(key.pub);
    
    return {
      private_key: privateKeyJsonTxt,
      public_key: publicKeyJsonTxt
    };

  },

  encryptKeyPair: function (hash, keypair) {

    var keypairTxt = JSON.stringify(keypair);
    return asocial.crypto.encryptEncode64(hash, keypairTxt);

  },

  buildPublicKeys: function(public_key_infos) {

    var _this = this;
    var publicKeys = {};

    $.each(public_key_infos, function(userId, publicKeyJson) {
      
        var publicKey = _this.ecc.buildPublicKey(publicKeyJson);
        publicKeys[userId] = publicKey;
        
    });

    return publicKeys;

  },

  decryptMessage: function(encMsg, encMsgKey) {
    
     var privateKey = asocial_private_key();
     var decMsgKey = this.ecc.decrypt(privateKey, encMsgKey);
     
     return sjcl.decrypt(decMsgKey, encMsg);
     
  },

  decryptPostsAndComments: function() {

    try {
      
      var _this = this;
      
      var callback = function (response) {
        
        var message = response.data.data;
        var id = response.data.id;

        var decrypted = marked(message);

        // Show the user tags.
        decrypted = asocial.helpers.replaceUserMentions(decrypted);

        // Hide the "This post is encrypted notice."
        $('#' + id).find('.encrypted-notice').remove();

        // Markdown the message and insert in place.
        $('#' + id).find('.encrypted').replaceWith(decrypted);
        
        asocial.helpers.formatPostsAndComments();
        
      };
      
      var workerPool = new WorkerPool(
        'js/asocial/workers/decrypt2.js', 4, callback
      );
      
      var privKeyJson = this.ecc.serializePrivateKey(asocial_private_key());
      
      // Decrypt each encrypted post on the page.
      $.each($('.encrypted'), function (i, element) {

        var message = $.parseJSON(element.innerText);
        message.content = JSON.stringify(message.content);
        
        var post = $(element).closest('.post');
        
        workerPool.queueJob({
          id: post.attr('id'),
          msg: message.content,
          key: message.key,
          privKey: privKeyJson
        });
        
      });

    } catch (e) {
      
     console.log(e);
      
     asocial.helpers.showAlert('Could not decrypt resource.');

    }
    
  },

  // Rename to decryptmedia.
  decryptMedia: function() {

    var _this = this;

    $.each($('.encrypted-image, .encrypted-audio, .encrypted-video'), function (index, image) {

      var image = $(image);

      var id = image.data('attachment-id');
          key = image.data('attachment-key'),
          type = image.data('attachment-type'),
          group = image.data('attachment-group');

      _this.getFile(id, key, function (url) {

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
          key = $this.data('attachment-key'),
          group = $this.data('attachment-group');

      _this.getFile(id, key, function (url) {

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

      var key = element.data('key');
      
      _this.getFile(id, key, function (url) {
        var avatars = $('.encrypted-avatar[data-user-id="' + user_id + '"]');
        $.each(avatars, function (index, element) { element.src = url; });
      });

    });

  },

  getFile: function (id, key, callback, group) {

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

    var download = function (id, key, group) {

      var group = group || CurrentSession.getGroupId();

      var baseUrl = 'http://localhost:5000/' + group + '/file/';

      var downloader = new Downloader(id, key,
        {
            baseUrl: baseUrl,
            privKey: asocial.crypto.ecc.serializePrivateKey(asocial_private_key())
        }
      );

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

            download(id, key, group);

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