let app = new Vue({
    el: '#app',
    data: {
        serverUrl: 'http://localhost:8080',
        books: [],
        classes: []
    },
    mounted: function () {
        this.getBookList();
        this.getBookClass();
        layui.use(['mm','carousel'],function(){
            var carousel = layui.carousel,
                mm = layui.mm;
            var option = {
                elem: '#carousel'
                ,width: '100%' //设置容器宽度
                ,arrow: 'always'
                ,height:'298'
                ,indicator:'none'
            };
            carousel.render(option);
        });
    },
    computed:{
        bookCount: function () {
            return this.books.length;
        },
        lastIndexOfClasses: function(){
            return this.classes.length-1;
        }
    },
    methods : {
        getBookList : function () {
            let _this = this;
            this.$http.get(this.serverUrl + '/bookList')
                .then((response)=>{
                    _this.books = response.body;
                });
        },
        bookName: function (index) {
            return this.books[index].bookName.length <= 11 ? this.books[index].bookName : this.books[index].bookName.substring(0,11) + '...';
        },
        getBookClass: function () {
            console.log("getBookClass");
            let _this = this;
            this.$http.get(this.serverUrl + '/bookClass')
                .then((response)=>{
                    _this.classes = response.body;
                });
        }
    }
});

