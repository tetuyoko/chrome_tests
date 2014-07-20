chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        window._data = request;
        console.log(request);
        var csrf = $("meta[name='csrf-token']").attr("content");
        var url = "https://github.com/upload/policies/assets";
        var formData = new FormData();
        formData.append("file", request.blob);
        formData.append("name", "image.png");
        formData.append("size", request.blob.size);
        formData.append("content_type", "image/png");
        $.ajax({
            url: url,
            type: "post",
            headers: {"X-CSRF-Token": csrf},
            data: formData,
            processData: false,
            contentType: false
        }).done(function(data){
            console.log(data);
            // $.ajax({
            //     url: data.upload_url,
            //     type: "post",
            //     headers: {"X-CSRF-Token": csrf},
            //     data: data.form,
            //     processData: false,
            //     contentType: false
            // })

            // $.ajax({
            //     url: data.asset_upload_url,
            //     type: "put",
            //     headers: {"X-CSRF-Token": csrf},
            //     processData: false,
            //     contentType: false
            // });
            var lgtm = "![LGTM](" + data.asset.href + ")";
            var oldMessage = $("textarea[name='comment[body]']").val();
            $("textarea[name='comment[body]']").val(oldMessage + "\n\n" + lgtm);
        });
    }
);
