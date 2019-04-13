let app = new Vue({
    el: '#app',
    data: {
        serverUrl: 'http://localhost:8080',
        transactions: [],
        checkbox: [],
    },
    mounted: function () {
        this.getTransactions(this.cookies.get("uid"));
    },
    computed:{
        selected: function () {
            return this.checkbox.length;
        },
        cookies: function () {
            return header.cookies;
        },
        shoppingCart:function () {
            return header.shoppingCart;
        }
    },
    methods : {
        getTransactions: function (uid) {
            let _this = this;

            this.$http.get(this.serverUrl + '/TransactionList?userId=' + uid)
                .then((response)=>{
                    _this.transactions = response.body;
                });
        },
        generateId: function (index) {
            return "checkbox_" + index;
        },
        checkAll: function (e) {
            let checkObj = document.querySelectorAll(".CheckBoxShop.check");
            if(e.target.checked){
                for(let i=0;i<checkObj.length;i++){
                    if(!checkObj[i].checked){
                        this.checkbox.push(checkObj[i].value)
                    }
                }
            }else{
                this.checkbox = [];
            }
        },
        remove: function (index) {
            let _this = this;
            this.$http.delete(app.serverUrl + '/Transaction',{
                "body":
                    {"orderNo": _this.transactions[index].orderNo},
                "emulateJSON":true
                })
                .then((response)=>{
                    layer.msg('删除成功');
                });
            let orderNo = this.transactions[index].orderNo;
            this.transactions.splice(index,1);
            let _index = this.checkbox.findIndex(i => i.orderNo === orderNo);
            this.checkbox.splice(_index,1);
        },
        removeSelected: function () {
            let _this = this;
            this.transactions.filter(i => this.checkbox.indexOf(i.orderNo) !== -1)
                .forEach(function (obj) {
                    _this.$http.delete(app.serverUrl + '/Transaction',{
                        "body":
                            {"orderNo": obj.orderNo},
                        "emulateJSON":true
                        })
                        .then((response)=>{
                            layer.msg('删除成功');
                        });
                });

            this.transactions = this.transactions
                .filter(i => this.checkbox.indexOf(i.orderNo) === -1);
        },
        orderTime: function (index) {
            let orderTime = this.transactions[index].orderTime;
            return orderTime.year + '-' + orderTime.monthValue + '-' +orderTime.dayOfMonth + ' ' + orderTime.hour + ':'
            + orderTime.minute + ':' + orderTime.second;
        }
    }
});