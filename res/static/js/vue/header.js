let header = new Vue({
    el: '#nav',
    data: {
        serverUrl: 'http://localhost:8080',
        cookies: new Map(),
        shoppingCart: []
    },
    mounted: function () {
        this.init();
        this.cookies2Map();
        this.getShoppingCart(this.cookies.get("uid"));
    },
    computed:{
        countInShoppingCart: function () {
            return this.shoppingCart.length;
        }
    },
    methods : {
        init: function(){
            $(".sn-back-home a").attr('href','index.html')
        },
        cookies2Map: function () {
            let _this = this;
            let map = new Map();
            let cookieList = document.cookie.split(';');
            for(let i in cookieList){
                let ck = cookieList[i].split('=');
                map.set(ck[0].trim(),ck[1].trim());
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
                    _this.shoppingCart = new Array();
                    for(let i in data){
                        _this.shoppingCart.push(data[i]);
                    }
                }
            });
        }
    }

});