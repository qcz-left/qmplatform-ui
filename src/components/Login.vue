<template>
  <div id="app">
    <div class="main-agileits">
      <h2 class="sub-agileits-w3layouts">登录系统</h2>
      <form id="login-form" action="javascript:;" type="post">
        <input type="text" name="loginName" v-model="loginName" placeholder="用户名" autocomplete="new-password"></input>
        <input type="password" name="loginPassword" v-model="loginPassword" placeholder="密码" autocomplete="new-password"></input>
        <a href="#" class="forgot-w3layouts">忘记密码 ?</a>
        <div class="submit-w3l">
          <input type="submit" @click="loginSubmit" value="登录">
        </div>
        <p class="p-bottom-w3ls">
          <a href="/#/login">这里注册</a>如果你还没有一个账号.
        </p>
      </form>
    </div>
  </div>
</template>

<script>
  var vmData = {
    loginName: '',
    loginPassword: ''
  };
  export default {
    name: "Login.vue",
    data() {
      return vmData;
    },
    methods: {
      loginSubmit: function () {
        var $this = this;
        this.$axios.get("/service-auth/oauth/token", {
          params:{
            grant_type: 'password',
            username: vmData.loginName,
            password: vmData.loginPassword,
            client_id: 'client_1',
            client_secret: '123456'
          }
        }).then(function (resp) {
          var result = resp.data;
          if (result.access_token) {
            top.location.href = "/";
          }
        }).catch(function (err) {
          var errData = err.response.data;
          var errorCode = errData.error;
          var errMsg = null;
          switch (errorCode) {
            case "unauthorized":
              errMsg = "账号不存在！";
              break;
            case "invalid_grant":
              errMsg = "密码输入错误，请重新输入！";
              break;
          }
          $this.$message({
            showClose: true,
            message: errMsg,
            type: 'error'
          });
        })
      }
    }
  }
</script>

<style scoped>
  #app {
    overflow: hidden;
    background: url("../assets/login.png");
    background-repeat: round;
  }

  .main-agileits {
    width: 30%;
    margin: 0 auto;
    margin-top: 10%;
    background: rgba(9, 9, 9, 0.46);
    box-shadow: 0px 35px 44px -22px #1f181b;
    padding: 60px 40px;
  }

  h2.sub-agileits-w3layouts, h3.sub-agileits-w3layouts {
    color: #fff;
    font-size: 20px;
    font-weight: 500;
    text-align: center;
    margin-bottom: 2em;
    letter-spacing: 2px;
  }

  .main-agileits input[type="text"], .main-agileits input[type="password"], .main-agileits input[type="email"] {
    outline: none;
    font-size: 15px;
    color: #ffffff;
    text-align: left;
    padding: 12px 14px;
    width: 95.5%;
    border: none;
    border-bottom: 1px solid #dadfe0;
    -webkit-appearance: none;
    margin-bottom: 30px;
    background: transparent;
    letter-spacing: 1px;
  }

  a.forgot-w3layouts {
    text-align: center;
    text-decoration: none;
    font-size: 14px;
    letter-spacing: 1px;
    text-transform: capitalize;
    color: #fff;
  }

  .submit-w3l {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }

  .submit-w3l input[type="submit"]:hover {
    background: #df5799;
    color: #ffffff;
    transition: 0.3s all;
    -webkit-transition: 0.3s all;
    -moz-transition: 0.3s all;
    -o-transition: 0.3s all;
    -ms-transition: 0.3s all;
  }

  .submit-w3l input[type="submit"] {
    background: #fff;
    color: #000;
    outline: none;
    display: block;
    margin: 0 auto;
    border: none;
    cursor: pointer;
    padding: 13px 38px;
    font-size: 14px;
    width: 100%;
    margin-top: 1em;
    font-weight: bold;
    text-transform: uppercase;
    transition: 0.3s all;
    -webkit-transition: 0.3s all;
    -moz-transition: 0.3s all;
    -o-transition: 0.3s all;
    -ms-transition: 0.3s all;
  }

  .p-bottom-w3ls {
    font-size: 14px;
    color: #eee;
    margin-top: 1em;
    text-align: center;
    text-transform: none;
    letter-spacing: 1px;
  }

  .p-bottom-w3ls a {
    color: #df5799;
    outline: none;
    text-decoration: none;
    margin-right: 8px;
    font-weight: 600;
  }

  input::-webkit-input-placeholder {
    color: white;
  }

  input::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: white;
  }

  input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: white;
  }

  input:-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: white;
  }

</style>
