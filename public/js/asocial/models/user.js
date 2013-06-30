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
    
    Crypto.initializeKeyfile(email, password, null, function (encryptedKeyfile) {
      _this.updateKeyfile(encryptedKeyfile, keyfileCreatedCb);
    });
  
  },
  
  createKeylist: function (keylistId, keylistCreatedCb) {

    var _this = this;
    
    Crypto.createKeylist(keylistId, function (encryptedKeyfile) {
      _this.updateKeyfile(encryptedKeyfile, keylistCreatedCb);
    });
    
  },
  
  deleteKeylist: function (keylistId, keylistDeletedCb) {
    
    var _this = this;
    
    Crypto.deleteKeylist(keylistId, function (encryptedKeyfile) {
      _this.updateKeyfile(encryptedKeyfile, keylistDeletedCb);
    });
    
  },
  
  updateKeyfile: function (encryptedKeyfile, keyfileUpdatedCb) {
    
    var _this = this;
    
    this.set('keyfile', encryptedKeyfile);
    
    Crypto.getSerializedKeyfile(function (e) { console.log("Updated key file", e); });
    
    this.save(null, {
      success: keyfileUpdatedCb,
      error: _this.userSaveError
    });
    
  },
  
  userSaveError: function () {
    alert('Error while saving user!');
  }

});