<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form" v-loading="loading"
               element-loading-text="正在登录，请稍后...">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="请输入验证码" v-model="loginForm.validateCode">
            <el-button type="success" :disabled="isDisabled" slot="append" @click="getValidateCode">{{validateCodeBtnName}}</el-button>
          </el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="loginSubmit">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {respMsg, respSuccess} from "../util/common";

  export default {
    data() {
      return {
        loading: false,
        loginForm: {
          username: 'qcz',
          password: '123456',
          validateCode: ''
        },
        // 这是表单的验证规则对象
        loginFormRules: {
          // 验证用户名是否合法
          username: [
            {required: true, message: '请输入登录名称', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
          ],
          // 验证密码是否合法
          password: [
            {required: true, message: '请输入登录密码', trigger: 'blur'}
          ]
        },
        validateCodeBtnName: '获取验证码',
        isDisabled: false,
        time: 60
      };
    },
    methods: {
      getValidateCode() {
        let _this = this;
        this.$get('/oauth2/getValidateCode', {
          loginName: this.loginForm.username
        }).then(function (result) {
          respMsg(result)
          if (respSuccess(result)) {
            // 倒计时
            _this.isDisabled = true;
            let interval = window.setInterval(function () {
              _this.validateCodeBtnName = '（' + _this.time + '秒）后重新发送';
              --_this.time;
              if (_this.time < 0) {
                _this.validateCodeBtnName = _this.$options.data().validateCodeBtnName
                _this.time = _this.$options.data().time
                _this.isDisabled = false;
                window.clearInterval(interval);
              }
            }, 1000);
          }
        })
      },
      // 点击重置按钮，重置登录表单
      resetLoginForm() {
        this.$refs.loginFormRef.resetFields();
      },
      loginSubmit() {
        this.loading = true;
        this.$post('/oauth2/login', this.loginForm).then(res => {
          this.loading = false;
          if (!this.$respSuccess(res)) {
            return this.$message.error(res.msg || '用户名或密码不正确！')
          }
          window.sessionStorage.setItem('token', res.data.accessToken);
          window.sessionStorage.setItem('refreshToken', res.data.refreshToken);
          window.sessionStorage.setItem('nowActive', '/welcome');
          this.$router.push('/');
        });
      }
    },
    watch: {
      'loginForm.username'(now) {
        if (!now) {
          this.isDisabled = true
        } else {
          this.isDisabled = false
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }
</style>
