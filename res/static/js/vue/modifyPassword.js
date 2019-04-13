let app = new Vue({
    el: '#app',
    data: {
        serverUrl: 'http://localhost:8080',
        cookies: new Map(),
        beforePassword:'',
        afterPassword:'',
        rePassword:''
    },
    mounted: function () {
        this.cookies2Map();
    },
    computed:{
        isSame:function () {
            return this.afterPassword === this.rePassword;
        }
    },
    methods : {
        cookies2Map: function () {
            let _this = this;
            let map = new Map();
            let cookieList = document.cookie.split(';');
            for(let i in cookieList){
                let ck = cookieList[i].split('=');
                map.set(ck[0].trim(),ck[1].trim())
            }
            _this.cookies = map;
        },
        update: function () {
            if(!this.isSame)
                return false;
            let uid = this.cookies.get("uid");
            let _this = this;

            this.$http.put(this.serverUrl + '/password',{
                    "id": uid,
                    "beforePassword":_this.beforePassword,
                    "afterPassword":_this.afterPassword
                },
                {"emulateJSON":true}
            )
                .then((response)=>{
                   if(response.body.code === 1) {
                       layer.msg("密码更改成功,2秒后返回");
                       setTimeout(function () {
                           window.history.back(-2);
                       }, 2 * 1000);
                   }else
                       layer.msg("密码修改失败");
                });
        },
        back: function () {
            window.history.back(-1);
        }
    }
});