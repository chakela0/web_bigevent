// ajax请求之前会执行此函数
$.ajaxPrefilter(function(options){
    // 操作请求url,加上请求根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;
});