let app = new Vue({
    el: '#app',
    data: {
        serverUrl: 'http://localhost:8080',
        cookies: new Map(),
        amount: ''
    },
    mounted: function () {
        this.cookies2Map();
    },
    computed:{
        isNumeric:function () {
            let reg = /^[1-9]\d*$/;
            return reg.test(this.amount);
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
        topup: function () {
            if(!this.isNumeric) {
                layer.msg("充值金额必须是正整数");
                return false;
            }
            let id = this.cookies.get("id");
            let _this = this;

            this.$http.put(this.serverUrl + '/balance',{
                    "id": id,
                    "rechargeAmount":_this.amount,
                },
                {"emulateJSON":true}
            )
                .then((response)=>{
                    layer.msg("充值成功，2秒后跳转")
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