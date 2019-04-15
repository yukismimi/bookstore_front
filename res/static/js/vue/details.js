let app = new Vue({
    el: '#app',
    data: {
        serverUrl: 'http://localhost:8080',
        bookId: window.location.href.toString().split("=")[1],
        details: {},
        amount: 1
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
            let id = header.cookies.get("id");

            this.$http.post(this.serverUrl+'/shoppingCart',
                JSON.stringify({
                    "userId": id,
                    "bookId": this.bookId,
                    "amount": amount
                })).then((response)=> {
                    header.getShoppingCart(id);
            });
        },
        add: function(){
            if(this.amount < this.details.stock)
                this.amount++;
        },
        minus: function(){
            if(this.amount > 1)
                this.amount--;
        },
        pay: function (event) {
            let transactions = [];
            let id = header.cookies.get("id");
            let transaction = {};
            transaction.bookId = this.details.id;
            transaction.userId = id;
            transaction.amount = this.amount;
            transaction.bookName = this.details.bookName;
            transaction.unitPrice = this.details.price;
            transactions.push(transaction);

            this.$http.post(this.serverUrl + '/Transaction',
                JSON.stringify(transactions))
                .then((response)=>{
                    if(response.body.code === 1){
                        header.getShoppingCart(id);
                        layer.msg("购买成功，2秒后跳转至订单页");
                        setTimeout(function () {
                            window.location.href = "transaction.html";
                        },2*1000);
                    }
                });
        }
    }
});

