let app = new Vue({
    el: '#app',
    data: {
        serverUrl: 'http://localhost:8080',
        checkbox: []
    },
    mounted: function () {
    },
    computed:{
        total: function () {
            let total = 0;
            for(let i in this.shoppingCart){
                if(this.checkbox.indexOf(this.shoppingCart[i].bookId) !== -1) {
                    total += this.shoppingCart[i].amount * this.shoppingCart[i].bookInfo.price;
                }
            }
            return total;
        },
        selected: function () {
            return this.checkbox.length;
        },
        cookies:function () {
            return header.cookies;
        },
        shoppingCart: function () {
            return header.shoppingCart;
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
            this.$http.get(this.serverUrl + '/shoppingCart?userId=' + uid)
                .then((response)=>{
                    _this.shoppingCart = response.body;
                });
        },
        add: function (index) {

            this.$http.put(this.serverUrl + '/shoppingCart',{
                "userId": this.shoppingCart[index].userId,
                "bookId": this.shoppingCart[index].bookId,
                "amount": ++this.shoppingCart[index].amount
            },{"emulateJSON":true}).then((response)=>{
                console.log("success");
            });
        },
        minus: function (index) {
            if(this.shoppingCart[index].amount > 1)
                this.$http.put(this.serverUrl + '/shoppingCart',{
                    "userId": this.shoppingCart[index].userId,
                    "bookId": this.shoppingCart[index].bookId,
                    "amount": --this.shoppingCart[index].amount
                },{"emulateJSON":true}).then((response)=>{
                    console.log("success");
                });
        },
        remove: function (index) {
            let uid = header.cookies.get("uid");

            this.$http.delete(this.serverUrl + '/shoppingCart',{
                "body":{
                    "userId": this.shoppingCart[index].userId,
                    "bookId": this.shoppingCart[index].bookId,
                },
                "emulateJSON":true
            })
                .then((response)=>{
                    layer.msg('删除成功');
                    header.getShoppingCart(uid);
                });

            let bookId = this.shoppingCart[index].bookId;
            this.shoppingCart.splice(index,1);
            let _index = this.checkbox.findIndex(i => i.bookId == bookId);
            this.checkbox.splice(_index,1);
        },
        removeSelected: function () {
            let _this = this;
            this.shoppingCart.filter(i => this.checkbox.indexOf(i.bookId) != -1)
                .forEach(function (obj) {
                    let uid = header.cookies.get("uid");
                    _this.$http.delete(app.serverUrl + '/shoppingCart',{
                       "body":{
                           "userId": obj.userId,
                           "bookId": obj.bookId,
                       },
                        "emulateJSON":true
                    })
                        .then((response)=>{
                            layer.msg('删除成功');
                            header.getShoppingCart(uid);
                        });
                });

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
        },
        pay: function (event) {
            if(this.checkbox.length == 0){
                layer.msg("您未选中任何商品");
                return false;
            }

            let transactions = [];
            let uid = header.cookies.get("uid");

            for(let i in this.checkbox){
                let transaction = {};
                let bid = this.checkbox[i];
                let obj = app.shoppingCart.filter(i => i.bookId === bid)[0];
                transaction.bookId = bid;
                transaction.userId = obj.userId;
                transaction.amount = obj.amount;
                transaction.bookName = obj.bookInfo.bookName;
                transaction.unitPrice = obj.bookInfo.price;
                transactions.push(transaction);
            }

            this.$http.post(this.serverUrl + '/Transaction',
                JSON.stringify(transactions))
                .then((response)=>{
                    if(response.body.code === 1){
                        header.getShoppingCart(uid);
                        layer.msg("购买成功，2秒后跳转至订单页");
                        setTimeout(function () {
                            window.location.href = "transaction.html";
                        },2*1000);
                    }
                });
        }
    }
});