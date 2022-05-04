$(function () {
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
    var form = layui.form;
    form.verify({
        nickmame: function (value) {
            if (value.length > 6) {
                return "昵称长度必须在1 - 6 个字符之间！"
            }
        }
    })

    initUserInfo();
    //初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: "get",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取用户信息失败！")
                }
                //调用form.val 快速为表单赋值
                form.val("formUserInfo", res.data)
            }
        })
    }


    //监听表单的提交事件
    $(".layui-form").on("submit", function (e) {
        //阻止表达的默认提交行为
        e.preventDefault();
        //发起ajax请求
        $.ajax({
            method: "post",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("更新用户信息失败！")
                }
                layer.msg("更新用户信息成功！")
                //调用父页面中的方法
                window.parent.getUserInfor(res.data);;
            }
        })
    })
    //重置事件
    $("#btnReset").on("click", function (e) {
        e.preventDefault();
        initUserInfo();
    })

})
