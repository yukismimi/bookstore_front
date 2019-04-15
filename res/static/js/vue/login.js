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
        this.reset();
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
                    layer.msg("登录成功,2秒后跳转");
                    setTimeout(function () {
                        // if (window.history.length > 1) {
                        //     window.history.back(-1);
                        // } else {
                        //     window.location.href = "index.html";
                        // }
                        window.location.href = 'index.html';
                    },2*1000);
                } else
                    alert(response.data.code)
            });
            return false;
        },
        regist: function (event) {
            if(this.passwordRegist !== this.rePasswordRegist) {
                layer.msg("两次密码输入不一致，请重新输入");
                return false;
            }

            this.$http.post(this.serverUrl + '/user',
                JSON.stringify({
                    "userName": this.usernameRegist,
                    "password": this.passwordRegist
                })).then((response)=> {
                if (response.body.code === 1) {
                    layer.msg("注册成功，3秒后返回登陆页面");
                    setTimeout(function () {
                        window.location.href = "login.html";
                    },3*1000);
                } else
                    layer.msg("注册失败");
            });
        },
        reset: function () {
            let cookieList = document.cookie.split(';');
            for(let i in cookieList){
                if(cookieList[i].trim() !== ''){
                    let ck = cookieList[i].split('=');
                    document.cookie = ck[0].toString() + '=;  expires=Thu, 01 Jan 1970 00:00:01 GMT;'
                }
            }
        }
    }

});