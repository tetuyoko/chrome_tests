var actualCode = '(' + function() {
    $(document).ajaxComplete(function() {
      if(location.hash.indexOf("type=general") >= 0){
        $(".publisher-placeholder:first-child, .yj-thread-list-item--reply-publisher").css("display", "none")
      }
    });
} + ')();';
var script = document.createElement('script');
script.textContent = actualCode;
(document.head||document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
