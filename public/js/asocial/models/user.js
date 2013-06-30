// Our basic Todo model has text, order, and done attributes.
var User = Backbone.RelationalModel.extend({

  idAttribute: "_id",
  url: 'users',
  //url: 'http://localhost:5000/users',

  relations: [
  {
    type: Backbone.HasOne,
    key: 'verifier',
    relatedModel: 'Verifier',
    reverseRelation: {
      key: 'user'
    }
  }],

  createKeyfile: function (password, keyfileCreatedCb) {

    var _this = this, email = this.get('email');
    
    Crypto.initializeKeyfile(email, password, null, function (keyfile) {
      
      var data = { keyfile: keyfile };
      
      _this.save(data, {
        success: keyfileCreatedCb,
        error: _this.userSaveError
      });
    
    });
  
  },
  
  createKeylist: function (keylistId, keylistCreatedCb) {
    
    var _this = this;
    
    Crypto.createKeylist(keylistId, function (encryptedKeyfile) {
      
      _this.set('keyfile', new Keyfile({ content: keyfile  }));
      
      _this.save(null, {
        success: keylistCreatedCb,
        error: _this.userSaveError
      });
      
    });
    
  },
  
  userSaveError: function () {
    alert('Error while saving user!');
  }

});