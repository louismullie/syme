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

var Session = Backbone.RelationalModel.extend({

  idAttribute: "_id",
  
  isAuthorized: function() {
    return Boolean(this.get("sessionId"));
  }

});


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

var AppRouter = Backbone.Router.extend({
  routes: {
    '*actions': 'defaultRoute',
    '/users/:id': 'openUser',
    '/users/:id/groups': 'listGroups',
    '/groups/:id': 'openGroup'
  },
  
  loadDynamicPage: function (url, requiresAuthentication, requiresAuthorization) {
    
    var urlComponents = this.parseUrl(url);
    
    if (!asocial.state.session && requiresAuthentification) {

      // Get the user.
      
      // Get the user's socket after state and authorization are done.
      asocial.socket.listen();

      // Decrypt the key pair.
      asocial.crypto.decryptKeypair(password);

    }

    if (!asocial.state.group && requiresAuthorization) {

      // Get the group.
      
      // Get the group's state (keylist, user list) from server.
      asocial.crypto.decryptKeylist(password);

    }

    this.renderAndBind(urlComponents);
    
  },
  
  renderAndBind: function(urlComponent) {

    var template = urlComponent.template;
    var url = urlComponent.url;
    
    Fifty.getAndRender(template, url, function(html) {

      if (html) {
        // Success
        $('#main').html(html);
        asocial.binders.bind(urlComponent.binder);
      } else {
        // Failure
        $('body').html( Fifty.render('error-notfound') );
        asocial.binders.unbind();
      }

    });
  
  },
  
  
  parseUrl: function(url) {

    asocial.helpers.debug('Loading url ' + url);
    
    var parser = document.createElement('a');
    parser.href = url; var uri = parser;
    
    // Split out the parts of the pathname.
    var parts = uri.pathname.split('/');
    
    // Delete first array element if empty.
    if (parts[0] == '') parts.shift();
    
    // Build an array representing the path.
    var path = [];
    
    // Delete uneven indices, since these
    // always correspond to resource IDs.
    for (i = 0; i < parts.length; i++) {
      if (i % 2 == 0) path.push(parts[i]);
    }
    
    // Get route base.
    var base = path[0];
    
    // Build the template name from the path.
    var template = path.join('-');
    
    // Build a hash with the URL's components.
    var urlComponent = {
      path: path,
      template: template,
      binder: base
    };
    
    return urlComponent;
    
  }
  
});

var router = new AppRouter;

router.on('route:defaultRoute', function(actions) {
  
  var actions = actions || 'sessions';
  var view = new StaticView();
  
  view.render(actions);
  
});

router.on('route:openUser', function(actions) {
  router.loadDynamicPage(actions, true);
});

router.on('route:listGroups', function(actions) {
  router.loadDynamicPage(actions, true);
});

router.on('route:openGroup', function(actions) {
  router.loadDynamicPage(actions, true, true);
});