let searchBar = new Vue({
    el: '#searchBar',
    data: {
        serverUrl: 'http://localhost:8080',
        bookName:''
    },
    methods: {
        findBook: function () {
            $.ajax({
                type: 'post',
                url: this.serverUrl + '/bookList',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: JSON.stringify({
                    'bookName': this.bookName
                }),
                success: function (json) {
                    app.books = [];
                    for (let i in json) {
                        console.log(json[i].bookName);
                        app.books.push(json[i]);
                    }
                    refreshPage();
                }
            });
            return false;
        }
    }
});