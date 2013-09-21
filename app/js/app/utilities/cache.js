Syme.Cache = {
  
  cache: { },
  
  get: function (id) {
    
    if (!this.cache[id])
      throw 'Non existent.';
    
    return this.cache[id];
    
  },
  
  contains: function (id) {
    
    return typeof(this.cache[id]) != 'undefined';
    
  },
  
  store: function (id, url) {
    
    var stored = this.cache[id];
    
    if (url != stored)
      this.cache[id] = url;
    
    return null;
    
  },
  
  delete: function (id) {
    
    var url = this.cache[id];
    
    Object.revokeObjectURL(url);
    
    delete url; delete id;
    
    return null;
    
  },
  
  getAsBlob: function (id, callback) {
    
    var blobUrl = this.getAsBlob[id];
    
    var xhr = new XMLHttpRequest;
    xhr.responseType = 'blob';

    xhr.onload = function() {
      
      var recoveredBlob = xhr.response;

      var reader = new FileReader;

      reader.onload = function() {
       var blobAsDataUrl = reader.result;
       window.location = blobAsDataUrl;
      };

      reader.readAsDataURL(recoveredBlob, callback);

    };

    xhr.open('GET', blobUrl);
    xhr.send();
    
    return null;
    
  }
  
};