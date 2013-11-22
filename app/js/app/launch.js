var extensionId = "kebgjahkgfpaeidbimpiefobehkjmani";
var extensionId = "fdedbiockeecnoiadfblkcgiaepoabji";

chrome.runtime.sendMessage(extensionId, { openUrlInEditor: 'syme.html' },
function(response) {
  if (!response.success) throw 'Could not open app.';
});

setTimeout(function(){var ww = window.open(window.location, '_self'); ww.close(); }, 100);