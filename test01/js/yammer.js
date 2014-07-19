function createImage(attachment){
    return {
        thumbnail_url: attachment.thumbnail_url,
        download_url: attachment.download_url
    }
    // download_url;
    // thumbnail_url
    // large_preview_url
}

function toHTML(image){
    return "<a href='" + image.download_url +  "'>" +
        "<img src='" + image.thumbnail_url + "'>" +
        "</a>" +
        "<br>";
}

$(function(){
    var tabId   = 0;
    chrome.tabs.query({"active": true}, function(tab){
        tabId = tab[0].id;
    });

    var $body = $(document.body);

    var groupID = "4450127";
    var url = "https://www.yammer.com/api/v1/messages/in_group/"+ groupID + ".json";
    $.getJSON(url, function(data, status, xhr){
        // console.log(data);
        // window._data = data;
        var images = [];
        data.messages.forEach(function(message){
            if(message.attachments){
                message.attachments.forEach(function(attachment){
                    // console.log(attachment);
                    images.push(createImage(attachment));
                });
            }
        });
        var image_tags = [];
        images.forEach(function(image){
            image_tags.push(toHTML(image));
        })
        $body.append(image_tags);
    });

    $(document).on("click", "a", function(e){
        $this = $(this);
        $this.replaceWith("<img src='./imgs/loading.gif'>");

        $.get($this.attr("href"), function(data, status, xhr){
            var blob = new Blob([data]);
            var blobURL = window.URL.createObjectURL(blob);

            var clipboard = $("<input/>");
            $("body").append(clipboard);
            clipboard.val(blobURL).select();
            document.execCommand('copy');
            clipboard.remove();
            console.log(blobURL);

            chrome.tabs.sendMessage(tabId,
                                    {image: "![LGTM](" + blobURL + ")"},
                                    function(response){
                                        window.close();
                                    });
        });
    });
});
