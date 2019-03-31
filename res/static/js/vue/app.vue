<script>
    const serverUrl = 'localhost:8080';
    vm = new Vue({
        mounted : function () {
            this.getBookList();
        },
        methods : {
            getBookList : function () {
                $.ajax({
                    type : 'get',
                    url : serverUrl + '/bookList',
                    dataType : 'json',
                    success : function (json) {
                        alert(json)
                        console.log(json)
                    }
                });
            }
        }
    })
</script>