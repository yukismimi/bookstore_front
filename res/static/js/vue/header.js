const header = new Vue({
    el: '#nav',
    data: {
        serverUrl: 'http://localhost:8080',
        cookies: new Map(),
        shoppingCart: []
    },
    mounted: function () {
        this.init();
        this.cookies2Map();
        this.getShoppingCart(this.cookies.get("id"));
    },
    computed:{
        countInShoppingCart: function () {
            return this.shoppingCart.length;
        },
        /*cookies:function () {
            let map = new Map();
            if(document.cookie === '')
                return new Map();
            let cookieList = document.cookie.split(';');
            for(let i in cookieList){
                let ck = cookieList[i].split('=');
                map.set(ck[0].trim(),ck[1].trim());
            }
            return map;
        }*/
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
                if(cookieList[i].trim() !== ''){
                    let ck = cookieList[i].split('=');
                    map.set(ck[0].trim(),ck[1].trim());
                }

            }
            _this.cookies = map
        },
        logout: function(){
            window.location.href = 'login.html';
        },
        getShoppingCart: function (id) {
            let _this = this;

            this.$http.get(this.serverUrl + '/shoppingCart?userId='+id)
                .then((response)=>{
                    _this.shoppingCart = response.body;
                });
        }
    }
});