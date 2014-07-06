$(function(){
    // var url = "https://www.yammer.com/mugenup.com/#/threads/inGroup?type=in_group&feedId=4450127";
    var url = "https://www.yammer.com/api/v1/messages.json";
    $.get(url, function(data, status, xhr){
        $(document.body).replaceWith(data);
        console.log(data);
        window._m_data = data;
    });
});
