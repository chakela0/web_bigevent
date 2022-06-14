$(function () {
    var layer = layui.layer;
    var form = layui.form;
    // 获取用户信息
    initUserInfo();

    // 重置按钮绑定点击事件
    $("#btnReset").on('click', function (e) {
        // 阻止默认重置行为
        e.preventDefault();
        // 发送请求 获取用户信息
        initUserInfo();
    });

    // 监听user_from表单提交
    $("#user_from").on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();

        // 发送ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败!');
                }

                // 更新成功
                layer.msg('更新用户信息成功!');
                // 调用index 的，获取用户信息方法
                window.parent.getUserInfo()
            }
        });
    })

    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败');
                }

                //获取用户信息成功,给表单赋值
                form.val('userinfo', res.data);
            }
        });
    }

    // 表单校验
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6个字符之间';
            }
        }
    });

});


