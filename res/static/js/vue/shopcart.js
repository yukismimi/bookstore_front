let app = new Vue({
    el: '#list-cont',
    data: {
        serverUrl: 'http://localhost:8080',
        shoppingCart: [],
        cookies: new Map()
    },
    mounted: function () {
        this.cookies2Map();
        this.getShoppingCart(this.cookies.get("uid"));
    },
    computed:{
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
            _this.cookies = map
        },
        getShoppingCart: function (uid) {
            let _this = this;
            $.ajax({
                type: 'get',
                url: this.serverUrl + '/shoppingCart?userId=' + uid,
                dataType: 'json',
                success: function (data) {
                    for(let i in data){
                        _this.shoppingCart.push(data[i])
                    }
                }
            });
        }
    }

});