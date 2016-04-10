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
    urls: ["*://mugenup.docbase.io/api/*"],
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
    // backgroud から content へは、sendMessage は使えない。sendMessage を使う
    // http://stackoverflow.com/questions/14245334/chrome-extension-sendmessage-from-background-to-content-script-doesnt-work
    //chrome.runtime.sendMessage({ type: "isGroupsPage" }, function(response) {});
    var url = details.url;
    chrome.tabs.getSelected(null, function(tab) {
      chrome.tabs.sendMessage(tab.id, {type: "isGroupsPage"}, function(response) {});
    });
  },
  {
    urls: ["*://mugenup.docbase.io/groups/*"],
    types: ["xmlhttprequest"]
  }
);
