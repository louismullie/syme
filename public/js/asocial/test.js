// Our basic Todo model has text, order, and done attributes.
var User = Backbone.RelationalModel.extend({

  idAttribute: "_id",
  url: 'http://localhost:5000/users',

  relations: [
  {
    type: Backbone.HasOne,
    key: 'keypair',
    relatedModel: 'Keypair',
    reverseRelation: {
      key: 'user'
    }
  },

  {
    type: Backbone.HasOne,
    key: 'verifier',
    relatedModel: 'Verifier',
    reverseRelation: {
      key: 'user'
    }
  }],

  createKeypair: function (password, callback) {

    // Generate a random salt for the password hash.
    var keypairSalt = asocial.crypto.generateRandomHexSalt();

    // Derive key form the user's password using the hex salt.
    var key = asocial.crypto.calculateHash(password, keypairSalt);

    // Generate an ECC keypair, convert to JSON and encrypt with key.
    var keypair = asocial.crypto.generateEncryptedKeyPair(key);

    // Build a request for the server to create a keypair for the user.
    this.set('keypair', new Keypair({ content: keypair, salt: keypairSalt }));

    // Save model.
    this.save(null, { success: callback, error: function () { alert('Error!'); }});

  }

});


var Verifier = Backbone.RelationalModel.extend({

  idAttribute: "_id",

});

var Keypair = Backbone.RelationalModel.extend({

  idAttribute: "_id",

});