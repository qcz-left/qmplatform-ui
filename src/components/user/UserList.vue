<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" align="left">
      <el-form-item label="用户名">
        <el-input placeholder="请输入内容" v-model="queryInfo.username" clearable/>
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="queryInfo.userSex" placeholder="请选择">
          <el-option v-for="item in optUserSex" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="doSearchList" icon="el-icon-search">查询</el-button>
        <el-button type="success" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
      </el-form-item>
    </el-form>
    <!-- 用户表单 -->
    <user-form ref="userFormRef"/>
    <!-- 用户列表 -->
    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column type="selection" width="40"/>
      <el-table-column type="index" width="40"/>
      <el-table-column prop="username" sortable label="用户名"/>
      <el-table-column prop="loginname" sortable label="登录名"/>
      <el-table-column prop="userSex" label="性别">
        <template slot-scope="scope">
          <template v-if="scope.row.userSex === '1'">
            <el-tag>男</el-tag>
          </template>
          <template v-else>
            <el-tag type="danger">女</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话"/>
      <el-table-column prop="emailAddr" sortable label="邮箱"/>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      align="right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, next, jumper"
      :total="400">
    </el-pagination>
  </div>
</template>

<script>
  import UserForm from "./UserForm";

  export default {
    name: "UserList",
    components: {UserForm},
    data() {
      return {
        // 列表查询参数
        queryInfo: {
          username: '',
          userSex: ''
        },
        // 数据列表
        tableData: [],
        // 性别下拉框数据
        optUserSex: [
          {value: '', label: '全部'},
          {value: '1', label: '男'},
          {value: '2', label: '女'}
        ],
        centerDialogVisible: false,
        loading: false,
        currentPage: 1
      }
    },
    created() {
      // 进入页面时主动获取一次列表数据
      this.getUserList();
    },
    methods: {
      handleCurrentChange() {

      },
      handleSizeChange() {

      },
      doSearchList() {
        this.getUserList();
      },
      /**
       * 获取用户列表
       */
      getUserList() {
        this.loading = true;
        this.$get("/system/user/getUserList", this.queryInfo).then(res => {
          this.tableData = res.data.list;
          this.loading = false;
        })
      },
      /**
       * 添加或编辑用户
       * @param row
       */
      handleEdit(row) {
        this.$refs.userFormRef.openDialog(row);
      },
      /**
       * 删除操作
       * @param row
       */
      handleDelete(row) {
        this.$confirm('此操作将永久删除 ' + row.username + ' 用户, 是否继续?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$del('/system/user/delUser/' + row.id, {}).then(res => {
            if (res.code === 200) {
              this.$message.success('删除成功!');
              this.getUserList();
            } else {
              this.$message.error('删除失败!');
            }
          });
        });
      }
    }
  }
</script>
