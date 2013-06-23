// Our basic Todo model has text, order, and done attributes.
var User = Backbone.RelationalModel.extend({

  idAttribute: "_id",
  url: '/users',

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

    // Generate an RSA keypair, convert to JSON and encrypt with key.
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

// var Session = Backbone.RelationalModel.extend({
//
//   idAttribute: "_id",
//
//   isAuthorized: function() {
//     return Boolean(this.get("sessionId"));
//   }
//
// });


StaticView = Backbone.View.extend({

  render: function(templateName) {
    var hbs  = '{{> ' + templateName + '}}';
    var template = Handlebars.compile(hbs);
    $('body').html(template({}));
    asocial.binders.bind(templateName);
  }

});

DynamicView = Backbone.View.extend({

    initialize: function(model) {
      this.data = model.toJSON();
      var hbs  = '{{> ' + template + '}}';
      this.template = Handlebars.compile(hbs);
    },

    render: function() {
      this.$el.html(this.template(this.getData()));
    },

    getData: function() {

      failure = failure || function(){};

      $.getJSON(url, function (data) {
        callback( Fifty.render(template, data) );
      }).fail(function(){
        callback( false );
      });

      return _.extend({}, this.model.toJSON(), data);
    }

});