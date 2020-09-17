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
        <el-button type="primary" @click="getMenuList" icon="el-icon-search">查询</el-button>
        <el-button type="success" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
      </el-form-item>
    </el-form>
    <!-- 用户表单 -->
    <el-dialog
      title="添加用户"
      :visible.sync="centerDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="30%"
      center>
      <el-form :model="editForm" :rules="rules" label-position="right" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" clearable/>
        </el-form-item>
        <el-form-item label="登录名" prop="loginname">
          <el-input v-model="editForm.loginname" clearable/>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="editForm.userSex" placeholder="请选择">
            <el-option v-for="item in optUserSex" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="editForm.phone" clearable/>
        </el-form-item>
        <el-form-item label="邮箱" prop="emailAddr">
          <el-input v-model="editForm.emailAddr" clearable/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="editForm.remark"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
          </span>
    </el-dialog>
    <!-- 用户列表 -->
    <el-table :data="tableData" border stripe>
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
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
  import {validPhone, validEmail} from "../../util/validate";

  export default {
    name: "UserList",
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
          {value: '1', label: '男'},
          {value: '2', label: '女'}
        ],
        centerDialogVisible: false,
        // 表单编辑参数
        editForm: {
          username: '',
          loginname: '',
          userSex: '',
          phone: '',
          emailAddr: '',
          remark: ''
        },
        // 表单校验规则
        rules: {
          username: [
            {required: true, message: '请填写用户名'}
          ],
          loginname: [
            {required: true, message: '请填写登录名'},
            {min: 3, max: 5, message: '长度在 3 到 5 个字符'}
          ],
          phone: [
            {required: true, validator: validPhone, trigger: 'blur'}
          ],
          emailAddr: [
            {required: true, validator: validEmail, trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      // 进入页面时主动获取一次列表数据
      this.getUserList();
    },
    methods: {
      getMenuList() {

      },
      /**
       * 获取用户列表
       */
      getUserList() {
        this.$get("/system/user/getUserList", {}).then(res => {
          this.tableData = res.data;
        })
      },
      /**
       * 添加或编辑用户
       * @param row
       */
      handleEdit(row) {
        if (row) {
          // 编辑
        } else {
          // 新增
          this.centerDialogVisible = true;
        }
      },
      /**
       * 删除操作
       * @param row
       */
      handleDelete(row) {
        this.$confirm('此操作将永久删除' + row.username + '用户, 是否继续?', '警告', {
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
