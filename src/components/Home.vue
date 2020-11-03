<template>
  <div class="component-div">
    <el-container style="height: 100%">
      <!-- 头部 -->
      <el-header>
        <span class="qm-title">Qu管理平台</span>
        <div class="header-right">
          <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#02af9f"
            mode="horizontal">
            <el-submenu index="1">
              <template slot="title">你好，{{userName}}</template>
              <el-menu-item index="1-1">安全设置</el-menu-item>
            </el-submenu>
            <el-menu-item index="2">退出</el-menu-item>
            <el-menu-item index="3">
              <el-color-picker title="选择皮肤"></el-color-picker>
            </el-menu-item>
          </el-menu>
        </div>
      </el-header>
      <el-container>
        <!-- 左侧边栏 -->
        <el-aside :width="isCollapse ? '64px' : '300px'">
          <!-- 展开或收起 -->
          <div class="menu-collapse" @click="openOrCloseCollapse">|||</div>
          <el-menu
            :default-active="defaultActive"
            class="el-menu-vertical-demo"
            background-color="#45464a"
            text-color="white"
            active-text-color="#02af9f"
            router
            :collapse="isCollapse"
            :collapse-transition="false"
            @select="menuSelected">
            <el-menu-item index="/welcome">
              <i class="el-icon-menu"></i>
              <span slot="title">主页</span>
            </el-menu-item>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>系统管理</span>
              </template>
              <el-menu-item index="/userList"><i class="el-icon-location"></i>用户管理</el-menu-item>
              <el-menu-item index="/role"><i class="el-icon-location"></i>角色管理</el-menu-item>
              <el-menu-item index="/organization"><i class="el-icon-location"></i>部门管理</el-menu-item>
              <el-menu-item index="2-5"><i class="el-icon-location"></i>图标管理</el-menu-item>
              <el-menu-item index="/menuList"><i class="el-icon-location"></i>菜单管理</el-menu-item>
            </el-submenu>
            <el-menu-item index="3">
              <i class="el-icon-document"></i>
              <span slot="title">操作日志</span>
            </el-menu-item>
            <el-menu-item index="4">
              <i class="el-icon-setting"></i>
              <span slot="title">测试404</span>
            </el-menu-item>
            <el-menu-item index="5">
              <i class="el-icon-setting"></i>
              <span slot="title">测试500</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <!-- 主体部分 -->
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import {getAuth, getUserName} from "../util/common";

  export default {
    name: "Home.vue",
    data() {
      return {
        isCollapse: false,
        defaultActive: '',
        userName: getUserName()
      }
    },
    created() {
      let nowActive = window.sessionStorage.getItem('nowActive');
      if (nowActive) {
        this.defaultActive = nowActive;
      } else {
        this.defaultActive = '/welcome';
        window.sessionStorage.setItem('nowActive', this.defaultActive);
      }
    },
    methods: {
      // 收起或展开折叠
      openOrCloseCollapse() {
        this.isCollapse = !this.isCollapse;
      },
      /**
       * 菜单选择回调
       */
      menuSelected(index) {
        window.sessionStorage.setItem('nowActive', index);
      }
    }
  }
</script>

<style lang="less" scoped>

  .menu-collapse {
    line-height: 30px;
    color: gainsboro;
    background: #666666;
    letter-spacing: 0.2em;
    cursor: pointer;
    text-align: center;
  }

  .el-header {
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }

  .el-header,.el-aside {
    background-color: rgb(84, 92, 100);
  }

  .el-aside > .el-menu {
    text-align: left;
  }

  .qm-title {
    font-size: 20px;
    float: left;
    color: #02af9f;
    padding-left: 50px;
  }

  .header-right {
    float: right;
  }
</style>
