

let app = new Vue({
    el: '#test1',
    data: {
        message: 'Hello Vue!',
        serverUrl: 'http://localhost:8080',
        books: [],
        pages: [],
        classes: []
    },
    mounted: function () {
        this.getBookList();
        this.getBookClass();
    },
    computed:{
        bookCount: function () {
            return this.books.length;
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
            });
        },
        getCurrPageBooks : function (page) {
            start = (page-1)*9;
            end = page*9;
            this.pages = this.books.slice(start,end)
        },
        bookName: function (index) {
            console.log(index);
            console.log(this.pages[index]);
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

