Syme.Compatibility = {

  inChromeExtension: function() {

    return (chrome && chrome.windows && chrome.windows.get &&
            typeof(chrome.windows.get) === 'function');

  },

  inPhoneGap: function() {
    return typeof(PhoneGap) != 'undefined';
  }

};

DEVELOPMENT = !Syme.Compatibility.inChromeExtension();