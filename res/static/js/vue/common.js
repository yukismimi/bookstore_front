Vue.http.interceptors.push((request, next) => {
    // ...
    // 请求发送前的处理逻辑
    console.log("interceptors");
    let token = cookies2Map();
    if( token.get('token') !== null){
        request.headers.set('token',token.get('token'));
    }

    next((response) => {
        // ...
        // 请求发送后的处理逻辑
        // ...
        // 根据请求的状态，response参数会返回给successCallback或errorCallback
        return response
    })
});
/*
import _global from 'global'
Vue.prototype.GLOBAL = _global;
export default {
    name: 'text',
    data () {
        return {
            token:this.GLOBAL.token,//直接通过this访问全局变量。
        }
    }
}*/

/*$().ready(function () {

    $.ajaxSetup({
        headers:{
            "Token":cookies2Map().get("token")
        },
        beforeSend: function () {
            console.log('before send');
        },
        success: function () {
            console.log('success');
        }
    });

});*/

cookies2Map = function () {
    let map = new Map();
    let cookieList = document.cookie.split(';');
    for(let i in cookieList){
        if(cookieList[i] !== '') {
            let ck = cookieList[i].split('=');
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