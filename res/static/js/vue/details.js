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
            $.ajax({
                type: 'get',
                url: this.serverUrl + '/book?id=' + id,
                dataType: 'json',
                success: function (json) {
                    _this.details = json
                }
            });
        },
        addToShoppingCart: function(){
            let amount = $("#amount").val();
            let uid = header.cookies.get("uid");
            $.ajax({
                type: 'post',
                url: this.serverUrl + '/shoppingCart',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: JSON.stringify({
                    "userId": uid,
                    "bookId": this.bookId,
                    "amount": amount
                }),
                success: function (data) {
                    console.log("success");
                    console.log(data);
                    header.getShoppingCart(uid);
                },
                error:function (data) {
                    console.log(data)
                }
            });

        }
    }

});

