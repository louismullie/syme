Syme.Url = {
  
  fromBase: function () {
    return this.buildFrom(arguments);
  },
  
  fromCurrentUser: function () {
    return this.buildFrom(arguments, true);
  },
  
  fromCurrentGroup: function () {
    return this.buildFrom(arguments, true, true);
  },
  
  fromGroup: function (groupId) {
    
    var baseUrl = this.fromCurrentUser();
    
    return this.join(baseUrl, 'groups', groupId);
    
  },
  
  buildFrom: function (chunks, user, group) {
    
    var chunks = Array.prototype.slice.call(chunks);
    var substrs = {}, session = Syme.CurrentSession;
    
    if (group) {
      substrs.currentGroup = session.getGroupId();
      chunks.unshift('groups/%(currentGroup)s');
    }
    
    if (user) {
      substrs.currentUser = session.getUserId();
      chunks.unshift('users/%(currentUser)s');
    }
    
    chunks.unshift(SERVER_URL);
    
    return this.build(chunks, substrs);
    
  },
  
  build: function(chunks, substrs) {
    
    var chunks = _.map(chunks, function (chunk) {
      return sprintf( chunk, substrs );
    });
    
    return chunks.join('/');
    
  },
  
  join: function () {
    
    // Transform the Arguments object into an array of arguments.
    var args = Array.prototype.slice.call(arguments, 0);
    
    // Reject all undefined or empty values in the array.
    var args = _.reject(args, function (arg) { return !arg; });
    
    // Join all the arguments with the URL path separator.
    return args.join('/');
    
  }
  
};