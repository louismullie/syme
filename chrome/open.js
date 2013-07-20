chrome.browserAction.onClicked.addListener(function(tab) {
  
  var symeUrl = chrome.extension.getURL('syme.html');

  chrome.tabs.create( {'url': symeUrl }, function(tab) { });


});