$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 请求参数
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    initTable();
    initCate();

    // 代理方式给btn-del绑定点击事件
    $("tbody").on('click', ".btn-del", function () {
        //获取删除按钮个数
        var len = $(".btn-del").length;
        //获取文章id
        var id = $(this).attr('data-id');

        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            // 发送ajax
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }

                    //删除成功
                    layer.msg('删除成功')

                    // 如果是删除当前页码最后一条数据
                    if (len === 1) {
                        // 页码 -1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }

                    // 刷新文章列表
                    initTable();
                }
            });

            layer.close(index);
        });


    })

    // 表单绑定提交事件
    $("#form_search").on('submit', function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        // 获取分类 和状态
        var cate_id = $("[name=cate_id]").val();
        var state = $("[name=state]").val();

        // 设置给q
        q.cate_id = cate_id;
        q.state = state;

        // 请求数据
        initTable();
    });


    // 初始化分类数据
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败');
                }

                // 模版渲染
                var htmlStr = template('tpl-cate', res);
                $("[name=cate_id]").html(htmlStr);

                //表单渲染
                form.render();
            }
        })
    }


    // 初始化文章列表
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取列表失败');
                }

                // 模版引擎
                var htmlStr = template('tpl-list', res);
                // 渲染到页面
                $("tbody").html(htmlStr);

                //渲染分页
                renderPage(res.total)
            }
        });
    }

    // 定义美化时间的过滤器
    template.defaults.imports.dateFormat = function (date) {
        var dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 补0函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    //渲染分页
    function renderPage(total) {
        laypage.render({
            elem: 'page' //注意，这里的 test1 是 ID，不用加 # 号
            , count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            limits: [2, 3, 5, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function (obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit

                if (!first) {
                    initTable();
                }
            }
        });
    }
})