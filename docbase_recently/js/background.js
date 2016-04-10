/****
* アイコンのクリックで、モードをオン・オフする
* content_script の中からは、chrome.storage.local で状態を取得する
****/
var clicks = 1;
var toggleEnabled = function(){
  clicks += 1;
  return isEnabled();
}
var isEnabled = function(){
  return !!(clicks % 2);
}
var getIconPath = function(enabled){
  var iconName = enabled ? "icon-hidden-96.png" : "icon-96.png";
  return "./images" + iconName;
}
var setIcon = function(enabled, tab){
  var iconPath = getIconPath(enabled);
  chrome.pageAction.setIcon({ path: iconPath, tabId: tab.id });
}

// アイコンのクリックでモードを切り替える
chrome.pageAction.onClicked.addListener(function(tab) {
  var enabled = toggleEnabled();
  setIcon(enabled, tab);
  chrome.storage.local.set({ 'enabled': enabled })
});

// 該当のURLを開いたら、アイコンを有効化する
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (tab.url.indexOf("https://mugenup.docbase.io") > -1) {
    chrome.pageAction.show(tabId);
    var enabled = isEnabled();
    setIcon(enabled, tab);
  }
});

/****
* ダッシュボードの件数を20件にするハック
****/

// http://mzsm.me/2012/02/10/chrome17-webrequest-api/
var availableURLs = ["*://mugenup.docbase.io/*"];
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    var url = details.url;
    if (url.indexOf("/api/dashboard_objects?per_page=5&page=1") > -1) {
      var new_url = url.replace("per_page=5", "per_page=20");
      return { redirectUrl: new_url }
    }
  },
  {
    urls: availableURLs,
    types: ["xmlhttprequest"]
  },
  [
    "blocking"
  ]
);
