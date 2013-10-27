Syme.Locales = {
  
  introduction: {
    
    steps: {
      
      first: {
        action: "Create a group",
        explanation: "Name your first encrypted group:",
        example: "e.g. Family and friends"
      },

      second: {
        action: "Invite people:",
        explanation: "Enter a list of emails",
      	buttons: {
      		edit: "Add email",
      		submit: "Start sharing"
        }
      },

      third: {
        action: "Start sharing",
        explanation: "Welcome to your group.",
        subtext: {
          message: "It's lonely out here... Do you want to",
          link: "invite someone"
        }
      }

    }
    
  },

  account: {
    
    confirmation: {
      
      explanation: "Please confirm your account",
      buttons: {
        return_home: "Go back"
      }

    }

  }

};

Handlebars.registerHelper('t',

  function(str) {
    
    var path = str.split('.');
    var currentPath = Syme.Locales;
   
    try {
    
      _.each(path, function (nextPath, index) {
        console.log(nextPath);
         currentPath = currentPath[nextPath];
      });
      
      if (typeof(currentPath) !== 'string')
        throw 'Path does not point to a string.';
      
    } catch (e) {
      
      console.error('Locale not defined.');
      
    }
    
    return currentPath;
    
  }

);