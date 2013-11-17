Syme.Locales = {
  
  application: {
    
    title: "Syme"
    
  },
  
  authentication: {
    
    labels: {
      
      full_name: "Full name",
      email: "Email address",
      password: "Password",
      confirm_password: "Confirm password",
      remember_me: "Keep me logged in",
      already_register: "Already registered?",
      need_register: "Need an account?"
      
    },
    
    buttons: {
      
      log_in: "Log in",
      register: "Register",
      create_account: "Create one"
    
    }
    
  },
  
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
    
    notifications: {
    
      labels: {
        none_new: "No new notifications."
      }
    
    },
    
    settings: {
      
      title: "Settings",
      
      labels: {
        full_name: "Your name",
        delete_account: "Delete your account"
      },
      
      buttons: {
        save: "Save",
        saving: "Saving",
        delete_account: "Delete account"
      },
      
      messages: {
        delete_account: "<b>Warning.</b> Deleting your account is irreversible. Doing so will delete all data associated to your account, including all your posts and every group you have created.",
        delete_account_confirm: "Type <strong class=\"warning\">delete</strong> to delete your account."
      }
      
    },
    
    confirmation: {
      
      explanation: "Please confirm your account",
      buttons: {
        return_home: "Go back"
      }

    }

  },
  
  feed: {
    
    buttons: {
      new_content: "New content",
      loading_more: "Loading more posts..."
    }
    
  }

};

Handlebars.registerHelper('t',

  function(str) {
    
    var path = str.split('.');
    var currentPath = Syme.Locales;
   
    try {
    
      _.each(path, function (nextPath, index) {
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