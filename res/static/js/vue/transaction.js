let app = new Vue({
    el: '#app',
    data: {
        serverUrl: 'http://localhost:8080',
        shoppingCart: [],
        transactions: [],
        checkbox: [],
        cookies: new Map(),
    },
    mounted: function () {
        this.cookies2Map();
        this.getShoppingCart(this.cookies.get("uid"));
        this.getTransactions(this.cookies.get("uid"));
    },
    computed:{
        selected: function () {
            return this.checkbox.length;
        },
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
        getTransactions: function (uid) {
            let _this = this;
            $.ajax({
                type: 'get',
                url: this.serverUrl + '/TransactionList?userId=' + uid,
                dataType: 'json',
                success: function (data) {
                    for(let i in data){
                        _this.transactions.push(data[i])
                    }
                }
            });
        },
        generateId: function (index) {
            return "checkbox_" + index;
        },
        checkAll: function (e) {
            let checkObj = document.querySelectorAll(".CheckBoxShop.check");
            if(e.target.checked){
                for(var i=0;i<checkObj.length;i++){
                    if(!checkObj[i].checked){
                        this.checkbox.push(checkObj[i].value)
                    }
                }
            }else{
                this.checkbox = new Array();
            }
        },
        remove: function (index) {
            $.ajax({
                type: 'delete',
                url: app.serverUrl + '/Transaction',
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                data: {
                    "orderNo": this.transactions[index].orderNo
                },
                success: function (data) {
                    layer.msg('删除成功');
                },
                error:function (data) {
                    console.log(data)
                }
            });
            let orderNo = this.transactions[index].orderNo;
            this.transactions.splice(index,1);
            let _index = this.checkbox.findIndex(i => i.orderNo == orderNo);
            this.checkbox.splice(_index,1);
        },
        removeSelected: function () {
            this.transactions.filter(i => this.checkbox.indexOf(i.orderNo) != -1)
                .forEach(function (obj) {
                    $.ajax({
                        type: 'delete',
                        url: app.serverUrl + '/Transaction',
                        contentType: "application/x-www-form-urlencoded; charset=utf-8",
                        data: {
                            "orderNo": obj.orderNo
                        },
                        success: function (data) {
                            layer.msg('删除成功');
                        },
                        error:function (data) {
                            console.log(data)
                        }
                    });
                });

            this.transactions = this.transactions
                .filter(i => this.checkbox.indexOf(i.orderNo) == -1);
        },
        orderTime: function (index) {
            let orderTime = this.transactions[index].orderTime;
            return orderTime.year + '-' + orderTime.monthValue + '-' +orderTime.dayOfMonth + ' ' + orderTime.hour + ':'
            + orderTime.minute + ':' + orderTime.second;
        }
    }
});