Object.defineProperty(window, 'guard', {
  get: function () {
    // check if defined
    return function(name, obj, proto) {
      "use strict";
      obj.prototype = proto;
      name = name == 'asocial' ? name : 'asocial_' + name;
      Object.defineProperty(window, name, {
        get: function () {
          return Object.freeze(obj);
        }
      });
    }
  }
});