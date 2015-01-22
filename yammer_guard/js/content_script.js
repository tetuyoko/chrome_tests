// console.log("content_script");
if(location.hash.indexOf("type=general") >= 0){
  // console.log(("type=general"));
  var style = document.createElement("style");
  var css = document.createTextNode(".publisher-placeholder:first-child, .yj-thread-list-item--reply-publisher { display: none; }");
  style.appendChild(css);
  document.head.appendChild(style);
}
