Vue.http.interceptors.push((request, next) => {
    // ...
    // 请求发送前的处理逻辑
    let cookies = cookies2Map();
    if( cookies.get('token') != null && cookies.get('token').trim() !== ''){
        request.headers.set('token',cookies.get('token'));
    }
    if( cookies.get('uid') != null && cookies.get('uid').trim() !== ''){
        request.headers.set('uid',cookies.get('uid'));
    }

    next((response) => {
        // ...
        // 请求发送后的处理逻辑
        // ...
        // 根据请求的状态，response参数会返回给successCallback或errorCallback
        if(response.status === 304){
            window.location.href = "login.html";
        }
        return response
    })
});

cookies2Map = function () {

    if(document.cookie === '')
        return new Map();

    let map = new Map();
    let cookieList = document.cookie.split(';');
    for(let i in cookieList){
        if(cookieList[i].trim() !== '') {
            let ck = cookieList[i].trim().split('=');
            map.set(ck[0].trim(), ck[1].trim());
        }
    }
    return map;
};

const refreshPage = function () {
    layui.use(['mm','laypage','jquery'],function(){
        var laypage = layui.laypage;
        let _this = this;
        laypage.render({
            elem: 'demo0',
            count: app.books.length,
            limit: 9,
            jump: function (obj,first) {
                app.getCurrPageBooks(obj.curr);
            }
        });
    });
};