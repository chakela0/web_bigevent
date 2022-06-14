$(function () {

    getUserInfo();

    // 获取layer
    var layer = layui.layer;

    // 退出登录
    $("#logout").on('click', function () {
        // 弹出提示
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //  删除localstorage token
            localStorage.removeItem('token');
            // 跳转到登录页面
            location.href='/login.html';

            layer.close(index);
        });
    });

   
});


 // 获取用户信息
 function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            console.log(res);
            if(res.status !== 0) {
                return layer.msg('获取用户信息失败');
            }
            // 渲染头像
            renderAvatar(res.data);
        }
    });
}

// 渲染头像
function renderAvatar(user) {
    var name = user.nickname || user.username;
    // 设置用户名
    $("#welcome").html('欢迎&nbsp;&nbsp;' + name);

    // 判断用户头像是否存在
    if (user.user_pic !== null) {
        // 有头像
        $(".layui-nav-img").attr('src', user.user_pic).show();
        // 隐藏文字头像
        $(".text-avatar").hide();
    } else {
        // 没有头像
        // 隐藏
        $(".layui-nav-img").hide();
        // 获取name首字母转大写
        var first = name[0].toUpperCase();
        $(".text-avatar").html(first).show();
    }
}