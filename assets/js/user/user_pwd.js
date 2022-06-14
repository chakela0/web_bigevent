$(function(){
    var layer = layui.layer;
    var form = layui.form;

    // 监听表单提交
    $(".layui-form").on('submit',function(e){
        // 阻止默认提交行为
        e.preventDefault();

        // 发送ajax
        $.ajax({
            method: "POST",
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('密码修改失败');
                }

                // 成功
                layer.msg('密码修改成功!');
                // 重置表单
                $(".layui-form")[0].reset();
            }
        });
    });

    // 表单校验
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ],
        samepwd: function(value){
            // 获取原密码
            var oldPwd = $("[name=oldPwd]").val();
            if(value === oldPwd){
                return '新密码不能与原密码一致'
            }
        },
        repwd: function(value){
           // 获取新密码
           var newPwd = $("[name=newPwd]").val();
            if(value !== newPwd){
                return '密码输入不一致!';
            }
        }
    });
});