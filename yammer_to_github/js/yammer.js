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
    // ネットワークを移動する
    $.getJSON("https://www.yammer.com/mugenup.com");

    var url = "https://www.yammer.com/api/v1/messages/in_group/"+ groupID + ".json";
    $.getJSON(url)
        .done(function(data, status, xhr){
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
        })
        .fail(function(xhr, status){
            $body.replaceWith("<div style='width: 200px'>読み取れません。ログインしていないか、ネットワークが違います</div>");
        });
}

$(function(){
    var $body = $(document.body);

    // groupID の画像を取り出して、HTMLを生成
    var groupID = "4450127";
    loadAndAppendGroupImages($body, groupID);

    // 画像がクリックされたとき、ダウンロードURLを、コンテンツスクリプトに委譲
    $(document).on("click", "a", function(e){
        $this = $(this);
        $this.replaceWith("<img src='./imgs/loading.gif'>");

        var download_url = $this.attr("href");
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.sendRequest(
                tab.id,
                { download_url: download_url },
                function(response){
                    window.close();
                });
        });
    });
});
