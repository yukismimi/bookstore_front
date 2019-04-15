let app = new Vue({
    el: '#app',
    data: {
        serverUrl: 'http://localhost:8080',
        cookies: new Map(),
        userInfo:{},
        balance: ''
    },
    mounted: function () {
        this.cookies2Map();
        this.getUserInfo();
        this.queryBalance();
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
            let id = this.cookies.get("id");
            let _this = this;
            this.$http.get(this.serverUrl + '/user?id=' + id)
                .then((response)=>{
                    _this.userInfo = response.body;
                });
        },
        queryBalance: function(){
            let _this = this;
            let id = this.cookies.get("id");
            this.$http.get(this.serverUrl + '/balance?id=' + id)
                .then((response)=>{
                    _this.balance = response.body.balance;
                });
        },
        update: function () {
            let id = this.cookies.get("id");
            let _this = this;
            this.$http.put(this.serverUrl + '/user',
                JSON.stringify({
                    "id": id,
                    "userName": this.userInfo.userName,
                    "age": this.userInfo.age,
                    "gender": this.userInfo.gender,
                    "mailAddress": this.userInfo.mailAddress,
                    "otherInfo":this.userInfo.otherInfo
                }))
                .then((response)=>{
                    layer.msg("更新成功,2秒后跳转");
                    setTimeout(function () {
                        window.location.href = 'index.html';
                    },2*1000);
                });
        },
        back: function () {
            window.history.back(-1);
        }
    }
});

