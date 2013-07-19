chrome.browserAction.onClicked.addListener(function(tab) {
  
  var symeUrl = chrome.extension.getURL('syme.html');
  
  // Check whether syme is already opened.
  chrome.tabs.query({ url: symeUrl }, function(tabs) {
    
    // Syme is not opened in this window.
    if (tabs.length == 0) {
      
      // Open Syme in a tab.
      chrome.tabs.create(
        {'url': symeUrl },
        function(tab) { }
      );
      
    // Syme is already open in another tab.
    } else {
      
      // Close all open tabs except the first.
      for (var i=1; i<tabs.length; i++)
        chrome.tabs.remove(tabs[i].id);
      
      // Focus on the first active tab.
      chrome.tabs.update(tabs[0].id, {active: true});
        
    }

 });

});