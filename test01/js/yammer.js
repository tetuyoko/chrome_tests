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
    var groupID = "4450127";
    var url = "https://www.yammer.com/api/v1/messages/in_group/"+ groupID + ".json";
    $.get(url, function(data, status, xhr){
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
        $(document.body).append(image_tags);
    });

    $(document).on("click", "a", function(e){
        $this = $(this);
        $.get($this.attr("href"), function(data, status, xhr){
            // console.log(status);
            var data = data;
        });
    });
});
