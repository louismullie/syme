// Our basic Todo model has text, order, and done attributes.
var User = Backbone.RelationalModel.extend({

  idAttribute: "_id",
  url: 'http://localhost:5000/users',

  relations: [
  {
    type: Backbone.HasOne,
    key: 'keyfile',
    relatedModel: 'Keyfile',
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

  createKeyfile: function (password, callback) {

    var email = this.get('email');
    var user = this;
    
    Crypto.initializeKeyfile(email, password, null, function () {
      
      Crypto.getEncryptedKeyfile(function (keyfile) {
        
        user.set('keyfile', new Keyfile({ content: keyfile  }));

        user.save(null, {
          
          success: callback,
          
          error: function () {
            alert('Error!');
          }
          
        }); // save
    
      }); // getEncryptedKeyfile
       
    }); // initializeKeyfile
  
  }

});