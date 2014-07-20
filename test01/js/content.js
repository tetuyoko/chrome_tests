function postS3(data, csrf, file, sendResponse){
    var formData = new FormData();
    for ( var key in data.form ) {
        formData.append(key, data.form[key]);
    }
    formData.append("file", file);

    var asset_upload_url = data.asset_upload_url;
    $.ajax({
        url: data.upload_url,
        type: "post",
        headers: {"X-CSRF-Token": csrf},
        data: formData,
        processData: false,
        contentType: false
    }).done(function(data){
        console.log(data);
        $.ajax({
            url: asset_upload_url,
            type: "put",
            headers: {"X-CSRF-Token": csrf},
            processData: false,
            contentType: false
        }).done(function(data, status, xhr){
            var lgtm = "![LGTM](" + data.href + ")";
            var oldMessage = $("textarea[name='comment[body]']").val();
            $("textarea[name='comment[body]']").val(oldMessage + "\n\n" + lgtm);
            console.log(sendResponse);
            sendResponse({});
        });
    });
}

function postGithub(file, filename, size, ContentType, sendResponse){
    var formData = new FormData();
    formData.append("file", file);
    formData.append("name", filename);
    formData.append("size", size);
    formData.append("content_type", ContentType);

    var csrf = $("meta[name='csrf-token']").attr("content");
    var url = "https://github.com/upload/policies/assets";
    $.ajax({
        url: url,
        type: "post",
        headers: {"X-CSRF-Token": csrf},
        data: formData,
        processData: false,
        contentType: false
    }).done(function(data){
        console.log(data);
        postS3(data, csrf, file, sendResponse);
    });
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request);
        console.log(sender);
        console.log(sendResponse);
        var download_url = request.download_url;
        xhr = new XMLHttpRequest();
        xhr.open('get', download_url, true);
        xhr.responseType = 'blob';
        xhr.onload = function(){
            if(this.status == 200){
                console.log(this);
                var blob = this.response;
                var ContentDisposition = xhr.getResponseHeader("Content-Disposition");
                var filename = ContentDisposition.match(/filename="([^"]+)"/)[1];
                var ContentType = xhr.getResponseHeader("Content-Type");
                var size = blob.size;
                postGithub(blob, filename, size, ContentType, sendResponse);
            }
        };
        xhr.send();
    }
);
