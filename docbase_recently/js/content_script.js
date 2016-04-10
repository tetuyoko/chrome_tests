var subMenuHider = function(){
  var $toggler = $('<div style="position:absolute;top:0;background:yellow;z-index:1;width:10px;height:20px;"></div>');
  var $closer = $toggler.clone().css({"right": 0}).text("<");
  var $opener = $toggler.clone().css({"left": 0, "display": "none"}).text(">");
  var $subMenu = $(".js-main-sub-menu");

  $(".sub-menu").prepend($closer);
  $(".js-main-content").prepend($opener);

  $closer.on("click", function(){
    $subMenu.hide();
    $opener.show();
    $(window).trigger("resize");
  })
  $opener.on("click", function(){
    $subMenu.show();
    $opener.hide();
    $(window).trigger("resize");
  })
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // console.log("receive message");
  switch (request.type) {
    case "isGroupsPage":
      subMenuHider();
      sendResponse({});
      break;
  }
});

// var actionIfEnabled = function(action) {
//   return function() {
//     chrome.storage.local.get('enabled', function (value) {
//       var enabled = value.enabled;
//       if (enabled === void 0) {
//         enabled = true;
//       }
//       if(enabled){
//         action()
//       }
//     })
//   }
// }
// var jumpToRecent = function() {
//   if(location.pathname == "/"){
//    var timer = setInterval(function(){
//      $link = $('a[href="/recent"]');
//      if(!!$link[0]){
//        clearInterval(timer);
//        $link.click();
//      }
//    }, 100)
//   }
// }
// read では初回しか反応しないのでダメ
// ajaxStop も ajaxComplete も、キャッチできなかった
//$(document).on("ready", actionIfEnabled(jumpToRecent));
// $(document).on("ready", function(e){
//   console.log("aaaaaaa");
// });
