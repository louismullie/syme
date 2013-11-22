function openApp() {
  
  var symeUrl = chrome.extension.getURL('syme.html');
  chrome.tabs.create( {'url': symeUrl }, function(tab) { });
  
}

chrome.storage.local.get('hasBeenOpened', function (setting) {
  
  if (!setting.hasBeenOpened) {
    
    chrome.storage.local.set({ hasBeenOpened:  true });
    openApp();

  }
  
});

if (chrome.browserAction)
  chrome.browserAction.onClicked.addListener(openApp);

chrome.runtime.onMessageExternal.addListener(
  function (request, sender, sendResponse) {
    openApp();
});