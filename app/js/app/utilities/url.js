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
    
    if (group) chunks.unshift('groups/%(currentGroup)s');
    if (user) chunks.unshift('users/%(currentUser)s');
    
    chunks.unshift(SERVER_URL);
    
    return this.build(chunks);
    
  },
  
  build: function(chunks) {
    
    var session = Syme.CurrentSession;
    
    var substrs = {
      currentGroup: session.getGroupId(),
      currentUser: session.getUserId()
    };

    var chunks = _.map(chunks, function (chunk) {
      return sprintf( chunk, substrs );
    });
    
    return chunks.join('/');
    
  },
  
  join: function () {
    return Array.prototype.slice.call(arguments, 0).join('/');
  }
  
};