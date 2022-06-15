$(function(){
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();

    // 代理,给btnDel绑定单击事件
    $("tbody").on('click','#btnDel',function(){
        // 获取当前id
        var id = $(this).attr('data-id');
        // 弹出确认
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            // 发送ajax请求
             $.ajax({
                method:'GET',
                url: '/my/article/deletecate/'+id,
                success:function(res){
                    if(res.status ===1 ){
                        return layer.msg('删除失败');
                    }

                    // 删除成功
                    layer.msg('删除成功')
                    // 刷新列表
                    initArtCateList();
                }
             });
            
            layer.close(index);
          });
    });

    // 监听编辑表单的提交
    $("body").on('submit','#form_edit',function(e){
        // 阻止表单默认提交行为
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res){
                console.log(res);
                if(res.status !== 0){
                    return layer.msg('更新失败');
                }

                // 刷新列表
                initArtCateList();
                // 弹出提示
                layer.msg('更新成功!')
                // 关闭弹出层
                layer.close(editIndex);
            }
        });
    });

    var editIndex = null;
    // 事件代理，给btnEdit绑定点击事件
    $("tbody").on('click','#btnEdit',function(){
        // 获取对应的id
        var id = $(this).attr('data-id');

        // 弹出层
        // 弹出表单
        editIndex = layer.open({
            area: ['500px', '250px'],
            type: 1,
            title: '修改文章分类'
            ,content: $("#dialog_form").html()
          });   
          
          // 发送ajax,获取数据
          $.ajax({
            method: 'GET',
            url: '/my/article/cates/'+id,
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('获取数据失败')
                }

                // 获取成功,给表单赋值
                form.val('form_edit',res.data);
            }
          });
    });

    // 事件委托，
    $("body").on('submit','#form_add',function(e){
        e.preventDefault();
        // 发送ajax请求 
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('添加文章类别失败')
                }

                // 添加成功
                initArtCateList();
                layer.msg('添加文章类别成功');

                // 关闭弹出层
                layer.close(addIndex);
            }
        });
    });

    var addIndex;

    // 添加分类按钮绑定单击事件
    $("#btnAddCate").on('click',function(){
        // 弹出表单
        addIndex = layer.open({
            area: ['500px', '250px'],
            type: 1,
            title: '添加文章分类'
            ,content: $("#form_html").html()
          });     
    });


    // 获取分类数据
    function initArtCateList(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                console.log(res);
                // 生成代码，渲染
                var htmlStr = template('tpl-table',res);
                $("tbody").html(htmlStr);
            }
        });
    }
})