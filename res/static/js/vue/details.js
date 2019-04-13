let app = new Vue({
    el: '#app',
    data: {
        serverUrl: 'http://localhost:8080',
        bookId: window.location.href.toString().split("=")[1],
        details: {}
    },
    mounted: function () {
        this.getDetailsById(this.bookId)
    },
    methods : {
        getDetailsById: function (id) {
            let _this = this;
            this.$http.get(this.serverUrl+'/book?id='+id)
                .then((response) =>{
                    _this.details = response.body;
                    });
        },
        addToShoppingCart: function(){
            let amount = $("#amount").val();
            let uid = header.cookies.get("uid");

            this.$http.post(this.serverUrl+'/shoppingCart',
                JSON.stringify({
                    "userId": uid,
                    "bookId": this.bookId,
                    "amount": amount
                })).then((response)=> {
                    header.getShoppingCart(uid);
            });
        },
        pay: function (event) {
            let transactions = [];
            let uid = header.cookies.get("uid");
            let amount = $("#amount").val();
            let transaction = {};
            transaction.bookId = this.details.id;
            transaction.userId = uid;
            transaction.amount = amount;
            transaction.bookName = this.details.bookName;
            transaction.unitPrice = this.details.price;
            transactions.push(transaction);

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

