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
  return "./images/" + iconName;
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
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    var url = details.url;
    if (url.indexOf("per_page=5&page=1") > -1) {
      var new_url = url.replace("per_page=5", "per_page=20");
      return { redirectUrl: new_url }
    }
  },
  {
    urls: ["*://mugenup.docbase.io/api/dashboard_objects"],
    types: ["xmlhttprequest"]
  },
  [
    "blocking"
  ]
);

/****
* グループの表示の時に、拡張を割りこませる
****/
chrome.webRequest.onCompleted.addListener(
  function(details) {
    var url = details.url;
    chrome.tabs.getSelected(null, function(tab) {
      chrome.tabs.sendMessage(tab.id, {type: "isGroupsPage"}, function(response) {});
    });
    // backgroud から content へは、sendMessage は使えない
    // http://stackoverflow.com/questions/14245334/chrome-extension-sendmessage-from-background-to-content-script-doesnt-work
    //chrome.runtime.sendMessage({ type: "isGroupsPage" }, function(response) {});
  },
  {
    urls: ["*://mugenup.docbase.io/groups"],
    types: ["xmlhttprequest"]
  }
);
