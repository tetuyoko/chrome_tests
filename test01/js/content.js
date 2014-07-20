chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        window._data = request;
        console.log(request);
        var csrf = $("meta[name='csrf-token']").attr("content");
        var url = "https://github.com/upload/policies/assets";
        var formData = new FormData();
        formData.append("myfile", request.blob);
        $.ajax({
            url: url,
            type: "post",
            headers: {
                "X-CSRF-Token": csrf
            },
            data: formData
            // processData: false,
            // contentType: false
        }).done(function(data){
            console.log(data);
        })
        //$input = $("#new_comment_field_write_bucket input[type='file']")[0];
        // $("textarea[name='comment[body]']").focus();
        // var oldMessage = $("textarea[name='comment[body]']").val();
        // $("textarea[name='comment[body]']").val(oldMessage + "\n\n" + request.image);
        // document.execCommand('paste');
    }
);
