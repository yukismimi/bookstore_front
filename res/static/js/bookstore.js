$(document).ready(function () {
    initData();
});

function initData(){
    $.ajax({
        type: 'get',
        url: 'http://localhost:8080/bookList',
        dataType: 'json',
        success: function (data) {
            console.log(data[0].bookName);
            $("div.layui-carousel div.item div.title").text(data[4].bookName);
        }
    });
};