let app = new Vue({
    el: '#app',
    data: {
        serverUrl: 'http://localhost:8080',
        cookies: new Map(),
        userInfo:{}
    },
    mounted: function () {
        this.cookies2Map();
        this.getUserInfo();
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
        getUserInfo: function () {
            let uid = this.cookies.get("uid");
            let _this = this;
            $.ajax({
                type: 'get',
                url: this.serverUrl + '/user?id=' + uid,
                dataType: 'json',
                success: function (data) {
                    _this.userInfo = data;
                }
            });
        },
        update: function () {
            let uid = this.cookies.get("uid");
            let _this = this;
            $.ajax({
                type: 'put',
                url: this.serverUrl + '/user',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    "id": uid,
                    "userName": this.userInfo.userName,
                    "age": this.userInfo.age,
                    "gender": this.userInfo.gender,
                    "mailAddress": this.userInfo.mailAddress,
                    "otherInfo":this.userInfo.otherInfo
                }),
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

