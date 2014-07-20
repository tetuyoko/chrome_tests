chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        window._data = request;
        //console.log(request);
        var csrf = $("meta[name='csrf-token']").attr("content");
        var url = "https://github.com/upload/policies/assets";

        var blob = new Blob([request.data], {type: "image/png", name: "image.png"});
        var formData = new FormData();
        formData.append("file", blob);
        formData.append("name", "image.png");
        formData.append("size", blob.size);
        formData.append("content_type", blob.type);
        $.ajax({
            url: url,
            type: "post",
            headers: {"X-CSRF-Token": csrf},
            data: formData,
            processData: false,
            contentType: false
        }).done(function(data){
            console.log(data);
            var formData = new FormData();
            for ( var key in data.form ) {
                formData.append(key, data.form[key]);
            }
            formData.append("file", blob);
            console.log(blob);

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
                });
            });
            var lgtm = "![LGTM](" + data.asset.href + ")";
            var oldMessage = $("textarea[name='comment[body]']").val();
            $("textarea[name='comment[body]']").val(oldMessage + "\n\n" + lgtm);
        });
    }
);
