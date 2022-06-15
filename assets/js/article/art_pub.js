$(function () {
    var layer = layui.layer;
    var form = layui.form;

    initCate();
    // 初始化富文本编辑器
    initEditor()

    // 获取文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg('获取分类失败')
                }

                // 模版引擎渲染
                var htmlStr = template('tpl-cate', res);
                $("[name=cate_id]").html(htmlStr);
                // ！！！一定要调用form.render()
                form.render()
            }
        });
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // btnChooseCover绑定单击事件
    $("#btnChooseCover").on('click', function () {
        // 点击file
        $("#fileCover").click();
    });


    // 给文件上传绑定change事件
    $("#fileCover").on('change', function (e) {
        // 获取选择的文件
        var files = e.target.files;
        console.log(files);

        if (files.length === 0) {
            // 用户没有选择图片
            return;
        }

        //根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0])

        //先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    var state = '已发布';

    // 草稿按钮设置点击事件
    $("#btnCaoGao").on('click', function () {
        state = '草稿';
    });

    // 监听form-art的提交
    $("#form-art").on('submit', function (e) {
        // 阻止默认提交行为
        e.preventDefault();

        // 根据form，创建FormData
        var fd = new FormData($(this)[0]);
        fd.append('state', state);

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);

                // 发布文章
                publishArticle(fd);
            })

          

    })

    //发布文章
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('文章发布失败');
                }

                layer.msg('发布成功')
                // 跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        });
    }
})