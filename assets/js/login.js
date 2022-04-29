$(function () {
    // 点击去注册的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    // 去登录的链接
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })
    // 自定义校验规则
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            var value1 = $('.reg-box [name=password]').val();
            if (value !== value1) {
                return "两次密码不一致"
            }

        }

    })


    // 监听注册表单的提交事件
    $('#form_item').on('submit', function (e) {
        e.preventDefault();
        var data = { username: $('#form_item [name=username]').val(), password: $('#form_item [name=password]').val() };
        $.post('http://www.liulongbin.top:3007/api/reguser', data, function (res) {
            if (res.status != 0) {
                return layer.msg(res.message);
            }
            layer.msg("注册成功！请登录");
            $('#link_login').click();
        })
    })
    // 监听登录表单的提交事件
    $.ajaxPrefilter(function (options) {
        console.log(options.url);
        options.url = "http://www.liulongbin.top:3007" + options.url;
    })
    $("#form_login").submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: "/api/login",
            method: "post",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("登录失败");
                }
                layer.msg("登录成功！");
                //跳转到后台主页
                localStorage.setItem("token", res.token);
                location.href = "/index.html";
            }
        })
    })
})