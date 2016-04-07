var actionIfEnabled = function(action) {
  return function() {
    chrome.storage.local.get('enabled', function (value) {
      var enabled = value.enabled;
      if(enabled){
        action()
      }
    })
  }
}
var jumpToRecent = function() {
  if(location.pathname == "/"){
   var timer = setInterval(function(){
     $link = $('a[href="/recent"]');
     if(!!$link[0]){
       clearInterval(timer);
       $link.click();
     }
   }, 100)
  }
}
$(document).on("ready", actionIfEnabled(jumpToRecent));
