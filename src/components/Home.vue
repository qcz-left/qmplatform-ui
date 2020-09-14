<template>
  <div class="index">
    <el-container style="height: 100%">
      <!-- 头部 -->
      <el-header>
        <span class="qm-title">Qu管理平台</span>
        <div class="header-right">
          <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#02af9f"
            class="el-menu-demo"
            mode="horizontal">
            <el-submenu index="1">
              <template slot="title">系统管理员</template>
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
        <el-aside>
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#45464a"
            text-color="white"
            active-text-color="#02af9f">
            <el-menu-item index="1">
              <i class="el-icon-menu"></i>
              <span slot="title">主页</span>
            </el-menu-item>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>系统管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="2-1"><i class="el-icon-location"></i>用户管理</el-menu-item>
                <el-menu-item index="2-2"><i class="el-icon-location"></i>菜单管理</el-menu-item>
                <el-menu-item index="2-3"><i class="el-icon-location"></i>角色管理</el-menu-item>
              </el-menu-item-group>
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
          <el-form :inline="true" class="demo-form-inline" align="left">
            <el-form-item label="活动名称">
              <el-input
                placeholder="请输入内容"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="活动区域">
              <el-select v-model="value" placeholder="活动区域">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getMenuList" icon="el-icon-search">查询</el-button>
              <el-button type="danger" icon="el-icon-plus">添加</el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="tableData"
            height="85%"
            border
            style="width: 100%">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="date"
              sortable
              label="日期"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini" icon="el-icon-edit">编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger" icon="el-icon-delete">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: "Index.vue",
    data() {
      return {
        color1: '#409EFF',
        tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: ''
      }
    },
    methods: {
      getMenuList() {
        this.$axios.get("/system/user/getUserList", {}).then(res => {

        })
      }
    }
  }
</script>

<style scoped>
  .index {
    height: 100%;
  }

  .el-header {
    background-color: rgb(84, 92, 100);
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    background-color: rgb(84, 92, 100);
    color: #333;
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
