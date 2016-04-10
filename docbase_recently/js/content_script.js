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
