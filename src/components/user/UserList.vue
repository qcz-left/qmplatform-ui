<template>
  <div class="component-div">
    <div class="form-div">
      <el-form :inline="true" align="left">
        <el-form-item label="用户名">
          <el-input v-model="tableConfig.queryParams.username"/>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="tableConfig.queryParams.userSex" placeholder="请选择">
            <el-option v-for="item in optUserSex" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearchList" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item class="form-operate">
          <el-button v-if="authority.save" type="success" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
          <el-button v-if="authority.delete" type="danger" icon="el-icon-delete" @click="batchDelete()">批量删除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-div">
      <!-- 用户列表 -->
      <table-pagination ref="tableRef" :tableConfig="tableConfig">
        <!--操作-->
        <template v-slot:operator="data">
          <el-button v-if="authority.save" size="mini" @click="handleEdit(data.row.id, data.row.username)">编辑</el-button>
          <el-button v-if="authority.delete" size="mini" type="danger" @click="deleteOne(data.row)">删除</el-button>
        </template>
        <!--性别-->
        <template v-slot:userSex="data">
          <el-tag v-if="data.value == 1">男</el-tag>
          <el-tag type="danger" v-else>女</el-tag>
        </template>
      </table-pagination>
    </div>
    <!-- 用户表单 -->
    <user-form ref="userFormRef"/>
  </div>
</template>

<script>
  import UserForm from "./UserForm";
  import TablePagination from "../common/TablePagination";
  import {getAttrFromArray, joinMulti, respMsg, hasAuthority} from "../../util/common";
  import {Msg, StatusType} from "../../util/constant";
  import {PrivCode} from "../../util/priv_code"

  export default {
    name: "UserList",
    components: {TablePagination, UserForm},
    data() {
      return {
        tableConfig: {
          url: '/system/user/getUserList',
          queryParams: {
            username: '',
            userSex: ''
          },
          columns: [
            {type: 'selection', width: 40},
            {type: 'index', width: 40},
            {label: '用户名', prop: 'username', sortable: true},
            {label: '登录名', prop: 'loginname', sortable: true},
            {label: '性别', prop: 'userSex', type: 'slot', slotName: 'userSex'},
            {label: '电话', prop: 'phone'},
            {label: '邮箱', prop: 'emailAddr', sortable: true},
            {label: '操作', align: 'center', width: 400, type: 'slot', slotName: 'operator'}
          ],
          pageSize: 50,
          orderName: 'username'
        },
        // 性别下拉框数据
        optUserSex: [
          {value: '', label: '全部'},
          {value: '1', label: '男'},
          {value: '2', label: '女'}
        ],
        authority: {
          save: hasAuthority(PrivCode.BTN_CODE_USER_SAVE),
          delete: hasAuthority(PrivCode.BTN_CODE_USER_DELETE)
        }
      }
    },
    created() {

    },
    methods: {
      doSearchList() {
        this.getList();
      },
      /**
       * 获取用户列表
       */
      getList() {
        this.$refs.tableRef.getList();
      },
      /**
       * 添加或编辑用户
       * @param row
       */
      handleEdit(id, name) {
        this.$refs.userFormRef.openDialog(id, name);
      },
      /**
       * 删除操作
       * @param row
       */
      handleDelete(ids, names) {
        let len = names.length;
        if (len == 0) {
          this.$message.warning('请至少选择一条数据');
          return;
        }
        this.$confirm('此操作将永久删除 <span class="text-danger">' + joinMulti(names) + '</span> ' + (len > 3 ? '等' : '') + '共 <span class="text-danger">' + names.length + '</span> 条记录, 是否继续?', '警告', {
          type: StatusType.WARNING,
          confirmButtonClass: 'el-button--warning'
        }).then(() => {
          this.$del('/system/user/delUser', {
            userIds: joinMulti(ids)
          }).then(res => {
            respMsg(res, Msg.DELETE_SUCCESS, Msg.DELETE_FAILURE, () => {
              this.getList()
            })
          }).catch(() => {

          });
        });
      },
      deleteOne(row) {
        this.handleDelete([row.id], [row.username]);
      },
      batchDelete() {
        let selected = this.$refs.tableRef.selected;
        this.handleDelete(getAttrFromArray(selected, 'id'), getAttrFromArray(selected, 'username'))
      }
    }
  }
</script>
