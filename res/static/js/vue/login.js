let app = new Vue({
    el: '#app',
    data: {
        serverUrl: 'http://localhost:8080',
        username: '',
        password: '',
        usernameRegist: '',
        passwordRegist: '',
        rePasswordRegist: '',
        isLogin: true
    },
    mounted: function () {

    },
    methods : {
        toggle: function () {
            this.isLogin = !this.isLogin;
        },
        login: function (event) {
            console.log("login methods")
            $.ajax({
                type: 'post',
                url: this.serverUrl + '/login',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: JSON.stringify({
                   "userName": this.username,
                   "password": this.password
                }),
                success: function (json) {

                    if(json.code == 1) {
                        document.cookie = "username=" + json.data.userName.toString();
                        document.cookie = "uid=" + json.data.id.toString();
                        if (window.history.length > 1) {
                            window.history.back(-1);
                        } else {
                            window.location.href = "index.html";

                        }
                    }
                    else
                        alert("password error")
                }
            });
            return false;
        },
        regist: function (event) {
            if(this.passwordRegist != this.rePasswordRegist)
                return false;
            console.log("regist methods")
            $.ajax({
                type: 'post',
                url: this.serverUrl + '/user',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: JSON.stringify({
                    "userName": this.usernameRegist,
                    "password": this.passwordRegist
                }),
                success: function (json) {
                    if(json.code == 1) {
                        console.log(json)
                        //window.location.href = "login.html";
                    }
                    else
                        alert("regist failed")
                }
            })
        }
    }

});