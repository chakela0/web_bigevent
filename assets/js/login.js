$(function () {
    // 监听登录表单提交事件
    $("#login_form").submit(function(e){
        e.preventDefault();
        // 发送请求
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0) return layer.msg('登录失败');

                // 提示
                layer.msg('登录成功');
                // 把返回的token 存入localstorage
                localStorage.setItem('token',res.token);
                // 跳转到首页
                location.href = '/index.html';
            }
        });
    });


    // 监听表单提交事件，
    $("#reg_form").on('submit',function(e){
        // 阻止表单默认提交行为
        e.preventDefault();

        //获取用户名和密码
        var username = $("#reg_form [name=username]").val();
        var password =  $("#reg_form [name=password]").val();
         // 发送请求
        $.post(
            '/api/reguser',
            {username: username,password: password},
            function(res) {
                // 请求成功回调函数
                if(res.status !== 0) return layer.msg('注册失败');

                // 弹出提示
                layer.msg('注册成功');

                // 跳到登录表单
                $(".links-login").click();
            }
        );
    });

    // 去出册
    $(".links-reg").on('click', function () {
        // 登录盒子隐藏，注册盒子显示
        $(".login-box").hide();
        $(".reg-box").show();


    });

    //去登录
    $(".links-login").on('click', function () {
        $(".login-box").show();
        $(".reg-box").hide();

    });

    // 获取lauyi的form
    var form = layui.form;
    form.verify({
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value){
            // value为表单的值
            // 获取密码输入框的值
            var pwd = $("#reg_form [name=password]").val();
            if(pwd !== value) {
                return '两次密码输入不一致';
            }
        }
    });
});