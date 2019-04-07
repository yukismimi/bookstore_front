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
            $.ajax({
                type: 'put',
                url: this.serverUrl + '/shoppingCart',
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                data: {
                    "userId": this.shoppingCart[index].userId,
                    "bookId": this.shoppingCart[index].bookId,
                    "amount": ++this.shoppingCart[index].amount
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
        minus: function (index) {
            if(this.shoppingCart[index].amount > 1)
                $.ajax({
                    type: 'put',
                    url: this.serverUrl + '/shoppingCart',
                    contentType: "application/x-www-form-urlencoded; charset=utf-8",
                    data: {
                        "userId": this.shoppingCart[index].userId,
                        "bookId": this.shoppingCart[index].bookId,
                        "amount": --this.shoppingCart[index].amount
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
        remove: function (index) {
            let uid = header.cookies.get("uid");
            $.ajax({
                type: 'delete',
                url: this.serverUrl + '/shoppingCart',
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                data: {
                    "userId": this.shoppingCart[index].userId,
                    "bookId": this.shoppingCart[index].bookId,
                },
                success: function (data) {
                    layer.msg('删除成功');
                    header.getShoppingCart(uid);
                },
                error:function (data) {
                    console.log(data)
                }
            });
            let bookId = this.shoppingCart[index].bookId;
            this.shoppingCart.splice(index,1);
            let _index = this.checkbox.findIndex(i => i.bookId == bookId);
            this.checkbox.splice(_index,1);
        },
        removeSelected: function () {
            this.shoppingCart.filter(i => this.checkbox.indexOf(i.bookId) != -1)
                .forEach(function (obj) {
                    let uid = header.cookies.get("uid");
                    $.ajax({
                        type: 'delete',
                        url: app.serverUrl + '/shoppingCart',
                        contentType: "application/x-www-form-urlencoded; charset=utf-8",
                        data: {
                            "userId": obj.userId,
                            "bookId": obj.bookId,
                        },
                        success: function (data) {
                            layer.msg('删除成功');
                            header.getShoppingCart(uid);
                        },
                        error:function (data) {
                            console.log(data)
                        }
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

            $.ajax({
                type: 'post',
                url: this.serverUrl + '/Transaction',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: JSON.stringify(transactions),
                success: function (json) {
                    if(json.code == 1){
                        console.log("success");
                        console.log(json);
                        header.getShoppingCart(uid);
                        layer.msg("购买成功，2秒后跳转至订单页");
                        setTimeout(function () {
                            window.location.href = "transaction.html";
                        },2*1000);
                    }
                },
                error:function (data) {
                    console.log(data)
                }
            });

        }
    }
});