Syme.Contacts = {
  
  initialize: function () {
   
    var googleauthUrl = 'https://127.0.0.1/oauth2callback';
    var clientId = '508447679977.apps.googleusercontent.com';
    var url = "https://accounts.google.com/o/oauth2/auth?state=profile&redirect_uri="+googleauthUrl+"&response_type=code&client_id="+clientId+"&approval_prompt=force&scope=https://www.google.com/m8/feeds/";

    console.log(url);
    
  },
  
  retrieve: function (token) {
    
    $.ajax({

      url: "https://www.google.com/m8/feeds/contacts/default/full" ,
      
      dataType: 'jsonp' ,
      
      data: { access_token: token, alt: 'json-in-script' },
      
      success: function (data, status) {
       console.log("The returned data", data)
      }
      
    })
    
  }
  
};