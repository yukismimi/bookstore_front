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
            this.$http.post(this.serverUrl+'/login',
                    JSON.stringify({
                    "userName": this.username,
                    "password": this.password
                })).then((response)=> {
                if (response.body.code === 1) {
                    document.cookie = "username=" + response.body.data.userName.toString();
                    document.cookie = "uid=" + response.body.data.id.toString();
                    document.cookie = "token=" + response.headers.get("Token").toString();
                    if (window.history.length > 1) {
                        window.history.back(-1);
                    } else {
                        window.location.href = "index.html";
                    }
                } else
                    alert(response.data.code)
            });

            /*$.ajax({
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
            });*/
            return false;
        },
        regist: function (event) {
            if(this.passwordRegist != this.rePasswordRegist) {
                layer.msg("两次密码输入不一致，请重新输入");
                return false;
            }
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
                        layer.msg("注册成功，3秒后返回登陆页面");
                        setTimeout(function () {
                            window.location.href = "login.html";
                        },3*1000);
                    }
                    else
                        alert("regist failed")
                }
            })
        }
    }

});