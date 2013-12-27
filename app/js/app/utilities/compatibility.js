Syme.Compatibility = {

  inChromeExtension: function() {

    // For all user agents except Chrome
    if (typeof(chrome) == 'undefined')  return false;
    
    // To distinguish between Chrome browser and extension.
    return (chrome && chrome.windows && chrome.windows.get &&
            typeof(chrome.windows.get) === 'function');

  },
  
  onAppleWebKit: function () {
    return !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
  },
  
  inPhoneGap: function() {
    return typeof(cordova) != 'undefined';
  }

};

DEVELOPMENT = !Syme.Compatibility.inChromeExtension();