guard('auth', {

  login: function(email, password, remember, success, fail, hack) {

    var srp = new SRPClient(email, password);

    var a = srp.srpRandom();
    var A = srp.calculateA(a);
    var _this = this;
    
    var params = $.param({ email: email, A: A.toString(16) });

    $.ajax(SERVER_URL + '/login/1', {
      
      type: 'POST', data: params,
      
      success: function (data) {
        
        if (data.B && data.salt) {

          var salt = data.salt;
          var B = new BigInteger(data.B, 16);
          var u = srp.calculateU(A, B);
          var Sc = srp.calculateS(B, salt, u, a);
          var M = srp.calculateM(email, salt, A, B, Sc);

          var params = $.param({ M: M.toString(16) });

          $('meta[name="_csrf"]').attr('content', data.csrf);
        
          $.post(SERVER_URL + '/login/2', params, function (data) {

             if (data.status == 'ok') {

              $('meta[name="_csrf"]').attr('content', data.csrf);
            
              success(srp.getDerivedKey());

            } else if (data.status == 'error') {
              
              // Non-deterministic Heisenbug with login
              if (hack) {
                
                Backbone.Relational.store.reset();
                CurrentSession = {};
                Router.navigate('login');
                
              } else {
                
                fail(data.reason);
                
              }

            } else {

              asocial.error.fatalError();

            }

          });

        } else if (data.status == 'error') {

          fail(data.reason);

        } else if (xhr.status == 401) {

          alert('Throttling!');
          
        }

    }, error: function (response) {
      
      if (response.status == 503) {
        fail('throttle');
      } else {  
        fail('server');
      }
      
      
    }});

  },

  logout: function (callback) {

    var callback = callback || function () {};

    CurrentSession = {};

    $.ajax(SERVER_URL + '/sessions/xyz', {
      type: 'delete',
      success: callback
    });

  },

  disconnect: function () {

    asocial.auth.logout();

    // Force disconnection
    asocial.helpers.showAlert('You have been disconnected', {
      title: 'Disconnected',
      submit: 'Log in',
      closable: false,
      onhide: function(){
        Router.navigate('/');
      }
    });

  }

});