let app = new Vue({
    el: '#app',
    data: {
        serverUrl: 'http://localhost:8080',
        shoppingCart: [],
        cookies: new Map(),
        checkbox: []
    },
    mounted: function () {
        this.cookies2Map();
        this.getShoppingCart(this.cookies.get("uid"));
    },
    computed:{
        total: function () {
            let total = 0;
            for(let i in this.shoppingCart){
                if(this.checkbox.indexOf(this.shoppingCart[i].bookId) != -1) {
                    total += this.shoppingCart[i].amount * this.shoppingCart[i].bookInfo.price;
                }
            }
            return total;
        },
        selected: function () {
            return this.checkbox.length;
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
        },
        add: function (index) {
            this.shoppingCart[index].amount++;
        },
        minus: function (index) {
            if(this.shoppingCart[index].amount > 1)
                this.shoppingCart[index].amount--;
        },
        remove: function (index) {
            let bookId = this.shoppingCart[index].bookId;
            this.shoppingCart.splice(index,1);
            let _index = this.checkbox.findIndex(i => i.bookId == bookId);
            this.checkbox.splice(_index,1);
        },
        removeSelected: function () {
            this.shoppingCart = this.shoppingCart
                .filter(i => this.checkbox.indexOf(i.bookId) == -1);
        },
        generateId: function (index) {
            return "checkbox_" + index;
        },
        checkAll: function (e) {
            let checkObj = document.querySelectorAll(".CheckBoxShop.check");
            if(e.target.checked){
                for(var i=0;i<checkObj.length;i++){
                    if(!checkObj[i].checked){
                        this.checkbox.push(parseInt(checkObj[i].value))
                    }
                }
            }else{
                this.checkbox = new Array();
            }
        }
    }
});