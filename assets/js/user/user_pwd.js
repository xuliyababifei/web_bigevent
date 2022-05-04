$(function () {
    // 监听登录表单的提交事件
    $.ajaxPrefilter(function (options) {
        console.log(options.url);
        options.url = "http://www.liulongbin.top:3007" + options.url;


        if (options.url.indexOf("/my/") !== -1) {
            options.headers = {
                Authorization: localStorage.getItem("token") || "",
            }
        }
        options.complete = function (res) {
            console.log(res);
            if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
                localStorage.removeItem("token");
                location.href = "/login.html";
            }
        }

    })

    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value === $("[name=oldPwd]").val()) {
                return "两次密码一致！";
            }
        },
        rePwd: function (value) {
            if (value !== $("[name=newPwd]").val()) {
                return "两次密码不一致！"
            }
        }
    })
    $(".layui-form").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: "post",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("更新密码失败！")
                }
                layer.msg("更新密码成功！");
                //重置表单
                $(".layui-form")[0].reset();
            }
        })
    })

})