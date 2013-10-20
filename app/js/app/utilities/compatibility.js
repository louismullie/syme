Syme.Compatibility = {

  inChromeExtension: function() {

    // For all user agents except Chrome
    if (typeof(chrome) == 'undefined')  return false;
    
    // To distinguish between Chrome browser and extension.
    return (chrome && chrome.windows && chrome.windows.get &&
            typeof(chrome.windows.get) === 'function');

  },
  
  inSafariOrWebView: function () {
    return /(iPhone|iPod|iPad).*AppleWebKit/i.test(navigator.userAgent);
  },
  
  inPhoneGap: function() {
    return typeof(PhoneGap) != 'undefined';
  }

};

DEVELOPMENT = !Syme.Compatibility.inChromeExtension();