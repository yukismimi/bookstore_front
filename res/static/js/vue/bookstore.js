

let app = new Vue({
    el: '#test1',
    data: {
        message: 'Hello Vue!',
        serverUrl: 'http://localhost:8080',
        books: [],
        pages: [],
    },
    mounted: function () {
        this.getBookList();
        layui.use(['mm','carousel'],function(){
            var carousel = layui.carousel,
                mm = layui.mm;
            var option = {
                elem: '#test1'
                ,width: '100%' //设置容器宽度
                ,arrow: 'always'
                ,height:'298'
                ,indicator:'none'
            }
            
            carousel.render(option);
        });


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
                    _this.books.push(json[4])
                    _this.books.push(json[4])
                    _this.books.push(json[4])
                    _this.books.push(json[3])
                    _this.books.push(json[3])
                    _this.books.push(json[3])
                    _this.books.push(json[2])
                    _this.books.push(json[2])
                    _this.books.push(json[2])
                    _this.books.push(json[1])
                    _this.books.push(json[1])
                    _this.books.push(json[1])
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

                        $('.sort a').on('click',function(){
                            $(this).addClass('active').siblings().removeClass('active');
                        })
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
            end = page*9
            this.pages = this.books.slice(start,end)
        },
        bookName: function (index) {
            console.log(index)
            console.log(this.pages[index])
            return this.pages[index].bookName.length <= 20 ? this.pages[index].bookName : this.pages[index].bookName.substring(0,15) + '...';
        }
    }
});

