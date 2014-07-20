function createImage(attachment){
    return {
        thumbnail_url: attachment.thumbnail_url,
        download_url: attachment.download_url
    };
}

function toHTML(image){
    return "<a href='" + image.download_url +  "'>" +
        "<img src='" + image.thumbnail_url + "'>" +
        "</a>" +
        "<br>";
}

function loadAndAppendGroupImages($body, groupID){
    var url = "https://www.yammer.com/api/v1/messages/in_group/"+ groupID + ".json";
    $.getJSON(url, function(data, status, xhr){
        var images = [];
        data.messages.forEach(function(message){
            if(message.attachments){
                message.attachments.forEach(function(attachment){
                    images.push(createImage(attachment));
                });
            }
        });
        var image_tags = [];
        images.forEach(function(image){
            image_tags.push(toHTML(image));
        });
        $body.replaceWith(image_tags);
    });
}

$(function(){
    var $body = $(document.body);

    // groupID の画像を取り出して、HTMLを生成
    var groupID = "4450127";
    loadAndAppendGroupImages($body, groupID);

    // 画像がクリックされたとき、ダウンロード => github にアップロード
    $(document).on("click", "a", function(e){
        $this = $(this);
        $this.replaceWith("<img src='./imgs/loading.gif'>");

        var download_url = $this.attr("href");
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.sendMessage(
                tab.id,
                { download_url: download_url },
                function(response){
                    console.log(response);
                    window.close();
                });
        });
    });
});
