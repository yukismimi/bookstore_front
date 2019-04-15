let app = new Vue({
    el: '#test1',
    data: {
        message: 'Hello Vue!',
        serverUrl: 'http://localhost:8080',
        allBooks: [],
        pages: [],
        classes: [],
        filterClass: 99
    },
    mounted: function () {
        this.init();
        this.getBookList();
        this.getBookClass();
    },
    computed:{
        bookCount: function () {
            return this.books.length;
        },
        books: function () {
            if(this.filterClass !== 99)
                return this.allBooks.filter(book => book.bookClass === this.filterClass);
            else
                return this.allBooks;
        }
    },
    methods : {
        init: function(){
            header.cookies2Map();
            if(header.cookies.get('subClass') != null){
                this.filterClass = parseInt(header.cookies.get('subClass'));
                document.cookie = 'subClass=;  expires=Thu, 01 Jan 1970 00:00:01 GMT;'
            }
        },
        getBookList : function () {
            let _this = this;

            this.$http.get(this.serverUrl + '/bookList')
                .then((response)=>{
                    _this.allBooks = response.body;
                    layui.use(['mm','laypage','jquery'],function(){
                        var laypage = layui.laypage;
                        let _this = this;
                        laypage.render({
                            elem: 'demo0',
                            count: app.books.length,
                            limit: 9,
                            jump: function (obj,first) {
                                app.getCurrPageBooks(obj.curr)
                            }
                        });

                        $('.sort a').on('click',function(){
                            $(this).addClass('active').siblings().removeClass('active');
                        });
                        $('.list-box dt').on('click',function(){
                            if($(this).attr('off')){
                                $(this).removeClass('active').siblings('dd').show()
                                $(this).attr('off','')
                            }else{
                                $(this).addClass('active').siblings('dd').hide()
                                $(this).attr('off',true)
                            }
                        })

                    });
                });
        },
        getCurrPageBooks : function (page) {
            start = (page-1)*9;
            end = page*9;
            this.pages = this.books.slice(start,end)
        },
        bookName: function (index) {
            return this.pages[index].bookName.length <= 20 ? this.pages[index].bookName : this.pages[index].bookName.substring(0,15) + '...';
        },
        sortByPrice: function (event) {
            this.books.sort(function (a,b,) {
                return b.price - a.price;
            });
            layui.use(['mm','laypage','jquery'],function(){
                var laypage = layui.laypage
                let _this = this
                laypage.render({
                    elem: 'demo0',
                    count: app.books.length,
                    limit: 9,
                    jump: function (obj,first) {
                        app.getCurrPageBooks(obj.curr)
                    }
                });
            });
        },
        sortByStock: function (event) {
            this.books.sort(function (a,b,) {
                return b.stock - a.stock;
            });
            layui.use(['mm','laypage','jquery'],function(){
                var laypage = layui.laypage
                let _this = this;
                laypage.render({
                    elem: 'demo0',
                    count: app.books.length,
                    limit: 9,
                    jump: function (obj,first) {
                        app.getCurrPageBooks(obj.curr)
                    }
                });
            });
        },
        getBookClass: function () {
            let _this = this;
            this.$http.get(this.serverUrl + '/bookClass')
                .then((response)=>{
                    _this.classes = response.body;
                });
        },
        filter: function (clazz) {
            this.filterClass = clazz;
            layui.use(['mm','laypage','jquery'],function(){
                var laypage = layui.laypage;
                let _this = this;
                laypage.render({
                    elem: 'demo0',
                    count: app.books.length,
                    limit: 9,
                    jump: function (obj,first) {
                        app.getCurrPageBooks(obj.curr)
                    }
                });

                $('.sort a').on('click',function(){
                    $(this).addClass('active').siblings().removeClass('active');
                });
                $('.list-box dt').on('click',function(){
                    if($(this).attr('off')){
                        $(this).removeClass('active').siblings('dd').show()
                        $(this).attr('off','')
                    }else{
                        $(this).addClass('active').siblings('dd').hide()
                        $(this).attr('off',true)
                    }
                })

            });
        }
    }
});