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
    <table-pagination :tableConfig="tableConfig">
      <template v-slot:operator="data">
        <el-button size="mini" @click="handleEdit(data.row)">编辑</el-button>
        <el-button size="mini" type="danger" @click="handleDelete(data.row)">删除</el-button>
      </template>
      <template v-slot:userSex="data">
        <el-tag v-if="data.value == 1">男</el-tag>
        <el-tag type="danger" v-else>女</el-tag>
      </template>
    </table-pagination>
  </div>
</template>

<script>
  import UserForm from "./UserForm";
  import TablePagination from "../common/TablePagination";

  export default {
    name: "UserList",
    components: {TablePagination, UserForm},
    data() {
      return {
        tableConfig: {
          // 数据列表
          tableData: [],
          url: '/system/user/getUserList',
          queryParams: this.queryInfo,
          columns: [
            {type: 'selection', width: 40},
            {type: 'index', width: 40},
            {label: '用户名', prop: 'username', sortable: true, width: 100},
            {label: '登录名', prop: 'loginname', sortable: true, width: 100},
            {label: '性别', prop: 'userSex', type: 'slot', slotName: 'userSex'},
            {label: '电话', prop: 'phone'},
            {label: '邮箱', prop: 'emailAddr', sortable: true},
            {label: '操作', align: 'center',type: 'slot',  slotName: 'operator'}
          ],
          handleSizeChange() {

          },
          handleCurrentChange() {

          }
        },
        // 列表查询参数
        queryInfo: {
          username: '',
          userSex: ''
        },
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
      doSearchList() {
        this.getUserList();
      },
      /**
       * 获取用户列表
       */
      getUserList() {
        this.tableConfig.getList();
      },
      /**
       * 添加或编辑用户
       * @param row
       */
      handleEdit(row) {
        console.log(row)
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
