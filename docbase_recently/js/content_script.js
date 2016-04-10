/****
* グループページに開閉ボタンを付ける。
****/

var subMenuHider = function(){
  var $toggler = $('<div style="position:absolute;top:0;background:yellow;z-index:1;width:10px;height:20px;cursor:pointer;"></div>');
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
  switch (request.type) {
    case "hidableSubMenu":
      subMenuHider();
      sendResponse({});
      break;
  }
});
