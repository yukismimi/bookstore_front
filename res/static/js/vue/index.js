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
            $.ajax({
                type : 'get',
                url : this.serverUrl + '/bookList',
                dataType : 'json',
                success : function (json) {
                    for(let i in json){
                        _this.books.push(json[i]);
                    }
                }
            });
        },
        bookName: function (index) {
            console.log(index);
            console.log(this.books[index]);
            return this.books[index].bookName.length <= 11 ? this.books[index].bookName : this.books[index].bookName.substring(0,11) + '...';
        },
        getBookClass: function () {
            let _this = this;
            $.ajax({
                type : 'get',
                url : this.serverUrl + '/bookClass',
                dataType : 'json',
                success : function (json) {
                    for(let i in json){
                        _this.classes.push(json[i]);
                    }
                }
            });
        }
    }
});

