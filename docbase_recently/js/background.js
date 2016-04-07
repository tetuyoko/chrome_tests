var clicks = 0;
var toggleEnabled = function(){
  clicks += 1;
  return isEnabled();
}
var isEnabled = function(){
  return !!(clicks % 2);
}
var getIconPath = function(enabled){
  if (enabled) {
    return "./images/icon-hidden-96.png";
  }
  else {
    return "./images/icon-96.png";
  }
}
var setIcon = function(enabled, tab){
  var iconPath = getIconPath(enabled);
  chrome.pageAction.setIcon({ path: iconPath, tabId: tab.id });
}

chrome.pageAction.onClicked.addListener(function(tab) {
  var enabled = toggleEnabled();
  setIcon(enabled, tab);
  chrome.storage.local.set({ 'enabled': enabled })
});

function checkForValidUrl(tabId, changeInfo, tab) {
  if (tab.url.indexOf("https://mugenup.docbase.io") > -1) {
    chrome.pageAction.show(tabId);
    var enabled = isEnabled();
    setIcon(enabled, tab);
    console.log(enabled);
  }
};
chrome.tabs.onUpdated.addListener(checkForValidUrl);
