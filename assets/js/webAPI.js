// ajax请求之前会执行此函数
$.ajaxPrefilter(function(options){
    // 操作请求url,加上请求根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;

    // 如果请求url包含/my/,添加请求头
    if(options.url.indexOf('/my/') !== -1){
        options.headers = {
            Authorization: localStorage.getItem('token')
        }
    }

    // 无论请求成功还是失败，都会调用此函数
    options.complete = function(res){
        // console.log('complete');
        console.log(res);
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
            // 清空token
            localStorage.removeItem('token');
            // 跳转登录页面
            location.href='/login.html';
        }
    }
    
});