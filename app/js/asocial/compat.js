guard('compat', {

  inChromeExtension: function() {

    return (chrome && chrome.windows && chrome.windows.get &&
            typeof(chrome.windows.get) === 'function');
  
  },
  
  inPhoneGap: function() {
    return typeof(PhoneGap) != 'undefined';
  }

});