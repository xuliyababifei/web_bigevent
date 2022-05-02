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

    getUserInfor();
    var layer = layui.layer;
    $('#btnLogout').on("click", function () {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            localStorage.removeItem('token');
            location.href = "/login.html";
            layer.close(index);
        });
    })
})

// 获取用户的基本信息
function getUserInfor() {
    $.ajax({
        method: "get",
        url: "/my/userinfo",

        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg("获取用户信息失败！");
            }
            // 调用renderAvatar 渲染用户头像
            renderAvatar(res.data);
        },

    })

}

//渲染用户头像
function renderAvatar(user) {
    var name = user.nickname || user.username;
    // console.log(name[0]);
    //设置欢迎的文本
    $('#welcome').html("欢迎&nbsp;&nbsp;" + name);
    //设置头像
    if (user.user_pic !== null) {
        $(".layui-nav-img").attr("src", user.user_pic).show();
        $(".text-avatar").hide();
    } else {
        $(".layui-nav-img").hide();
        var first = name[0].toUpperCase();
        $(".text-avatar").html(first).show();
    }
}

