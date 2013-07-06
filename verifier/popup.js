// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {

  var verified = 0;
  
  var xhr = new XMLHttpRequest();
  //xhr.open("GET", "https://crypto.cat/js/seedrandom.js", false);
  
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      hash = xhr.responseText;
      
    }
  }
  
  //xhr.send();
  
  if (verified === 8) {
    document.getElementById("main").innerHTML = "<span>Integrity check passed.</span>";
  } else {
    chrome.browserAction.setBadgeBackgroundColor({color: '#FF0000'});
    chrome.browserAction.setBadgeText({text:"?"});
    document.getElementById("main").innerHTML = "<span style=\"color:#F00\">Integrity check failed.</span><br />But wait, this doesn't necessarily mean that your connection is unsafe. This may just mean that you need to refresh your browser to get the latest version of Syme. Clear your browser cache and try again. Should the problem persist, this could mean that your session is unsafe.";
  }
  
});
