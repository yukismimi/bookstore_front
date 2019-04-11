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
            $.ajax({
                type: 'put',
                url: _this.serverUrl + '/password',
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                data:{
                    "id": uid,
                    "beforePassword":_this.beforePassword,
                    "afterPassword":_this.afterPassword
                },
                success: function (data) {
                    console.log("success");
                    console.log(data)
                },
                error:function (data) {
                    console.log(data)
                }
            });
        },
        back: function () {

        }
    }
});