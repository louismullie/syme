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
    
    URL.revokeObjectURL(url);
    
    delete url; delete id;
    
    return null;
    
  },
  
  clear: function () {
    
    var _this = this;
    
    _.each(_this.cache[id], function (url, id) {
      _this.delete(id);
    });
    
    return null;
    
  }
  
};