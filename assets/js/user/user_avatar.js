$(function () {
    // 监听登录表单的提交事件
    $.ajaxPrefilter(function (options) {
        options.url = "http://www.liulongbin.top:3007" + options.url;
        if (options.url.indexOf("/my/") !== -1) {
            options.headers = {
                Authorization: localStorage.getItem("token") || "",
            }
        }
        options.complete = function (res) {
            if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
                localStorage.removeItem("token");
                location.href = "/login.html";
            }
        }
    })
    var layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options);
    //为上传按钮绑定上传文件事件
    $("#btnChooseImage").on("click", function () {
        $("#file").click();
    })
    $("#file").on("change", function (e) {
        // console.log(e);
        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg("请选择照片！")
        }
        var file = e.target.files[0];
        var newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options);      // 重新初始化裁剪区域
    })
    $("#btnUpload").on('click', function () {
        //拿到裁剪之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')      // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        $.ajax({
            method: "post",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL,
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("更换头像失败！")
                }
                layer.msg("更换头像成功！");
                window.parent.getUserInfor();
            }
        })
    })
})