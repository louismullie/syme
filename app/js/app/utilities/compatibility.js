Syme.Compatibility = {

  inChromeExtension: function() {

    // For all user agents except Chrome
    if (typeof(chrome) == 'undefined')  return false;
    
    // To distinguish between Chrome browser and extension.
    return (chrome && chrome.windows && chrome.windows.get &&
            typeof(chrome.windows.get) === 'function');

  },
  
  supportedStorageType: function () {
    if (typeof(chrome) == 'undefined') {
      return 'dom';
    } else {
      return 'indexed-db';
    }
  },

  inPhoneGap: function() {
    return typeof(PhoneGap) != 'undefined';
  }

};

DEVELOPMENT = !Syme.Compatibility.inChromeExtension();