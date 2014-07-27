chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        var csrf = $("meta[name='csrf-token']").attr("content");

        function writeLGTM(data){
            var lgtm = "![LGTM](" + data.href + ")";
            var oldMessage = $("textarea[name='comment[body]']").val();
            if(oldMessage != ""){
                lgtm = oldMessage + "\n" + lgtm;
            }
            $("textarea[name='comment[body]']").val(lgtm);
            sendResponse({});
        }

        function putGithub(data, asset_upload_url){
            $.ajax({
                url: asset_upload_url,
                type: "put",
                headers: {"X-CSRF-Token": csrf},
                processData: false,
                contentType: false
            }).done(function(data, status, xhr){
                writeLGTM(data);
            });
        }

        function postS3(data, blob){
            var formData = new FormData();
            for ( var key in data.form ) {
                formData.append(key, data.form[key]);
            }
            formData.append("file", blob);

            var asset_upload_url = data.asset_upload_url;
            $.ajax({
                url: data.upload_url,
                type: "post",
                headers: {"X-CSRF-Token": csrf},
                data: formData,
                processData: false,
                contentType: false
            }).done(function(data){
                putGithub(data, asset_upload_url);
            });
        }

        function postGithub(blob){
            var formData = new FormData();
            formData.append("name", blob.filename);
            formData.append("size", blob.size);
            formData.append("content_type", blob.type);

            var url = "https://github.com/upload/policies/assets";
            $.ajax({
                url: url,
                type: "post",
                headers: {"X-CSRF-Token": csrf},
                data: formData,
                processData: false,
                contentType: false
            }).done(function(data){
                postS3(data, blob);
            });
        }

        var download_url = request.download_url;
        xhr = new XMLHttpRequest();
        xhr.open('get', download_url, true);
        xhr.responseType = 'blob';
        xhr.onload = function(){
            if(this.status == 200){
                var blob = this.response;
                var ContentDisposition = xhr.getResponseHeader("Content-Disposition");
                blob.filename = ContentDisposition.match(/filename="([^"]+)"/)[1];
                postGithub(blob);
            }
        };
        xhr.send();
    }
);
