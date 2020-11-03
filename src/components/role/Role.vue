<template>
  <div class="component-div">
    <div class="form-div">
      <el-form :inline="true" align="left">
        <el-form-item class="form-operate">
          <el-button type="success" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-div">
      <table-pagination ref="tableRef" :tableConfig="tableConfig">
        <!--操作-->
        <template v-slot:operator="data">
          <el-button size="mini" type="warning" icon="el-icon-thumb" @click="openPermissionDlg(data.row.roleId, data.row.roleName)">分配权限</el-button>
          <el-button size="mini" @click="handleEdit(data.row.roleId, data.row.roleName)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(data.row)">删除</el-button>
        </template>
      </table-pagination>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible="formVisiable"
      width="30%"
      @close="closeDialog"
      v-dialog-drag>
      <el-form :model="editForm" :rules="rules" label-position="right" label-width="100px" ref="editFormRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"/>
        </el-form-item>
        <el-form-item label="标识">
          <el-input v-model="editForm.roleSign"/>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="editForm.remark"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <!--分配权限-->
    <el-dialog
      :title="allotPerTitle"
      :visible="allotPerDlgVisiable"
      width="20%"
      @close="closePerDialog"
      v-dialog-drag>
      <el-tree
        :data="permissionTree"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closePerDialog">取 消</el-button>
        <el-button type="primary" @click="saveRolePermission">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {Msg, StatusType} from "../../util/constant";
  import TablePagination from "../common/TablePagination";
  import {showLoading} from "../../util/loading";
  import {respMsg} from "../../util/common";

  export default {
    name: "Role",
    components: {TablePagination},
    data() {
      return {
        tableConfig: {
          url: '/system/role/getRoleList',
          columns: [
            {label: '角色名称', prop: 'roleName', sortable: true},
            {label: '角色标识', prop: 'roleSign'},
            {label: '描述', prop: 'remark'},
            {label: '操作', align: 'center', type: 'slot', slotName: 'operator'}
          ],
          orderName: 'roleName'
        },
        dialogTitle: '',
        formVisiable: false,
        allotPerDlgVisiable: false,
        editForm: {
          roleId: '',
          roleName: '',
          roleSign: '',
          remark: ''
        },
        rules: {
          roleName: [
            {required: true, message: '请输入角色名称'}
          ]
        },
        permissionTree: [],
        defaultProps: {
          value: 'id',
          label: 'name',
          children: 'childes'
        },
        dlgRoleId: '',
        allotPerTitle: ''
      }
    },
    mounted() {

    },
    methods: {
      /**
       * 保存角色权限
       */
      saveRolePermission() {
        let checkedKeys = this.$refs.tree.getCheckedKeys();
        this.$post('/system/role/saveRolePermission', {
          roleId: this.dlgRoleId,
          permissionIds: checkedKeys
        }).then(result => {
          respMsg(result, '分配权限成功', '分配权限失败', () => {
            this.closePerDialog()
          })
        })
      },
      openPermissionDlg(roleId, roleName) {
        this.allotPerTitle = '分配权限 - ' + roleName
        this.allotPerDlgVisiable = true
        this.dlgRoleId = roleId
        this.$get('/system/role/getRolePermission/' + roleId, {}).then(result => {
          let permissionIds = result.data;
          this.$get('/system/menu/getMenuList', {}).then(result => {
            this.permissionTree = result.data
            this.$refs.tree.setCheckedKeys(permissionIds)
          });
        })
      },
      /**
       * 获取列表
       */
      getList() {
        this.$refs.tableRef.getList();
      },
      /**
       * 添加或编辑
       * @param row
       */
      handleEdit(id, name) {
        if (id) {
          this.dialogTitle = '编辑 - ' + name
          this.$get('/system/role/getRoleOne/' + id, {}).then(result => {
            this.editForm = result.data;
          });
        } else {
          this.dialogTitle = '添加'
        }
        this.formVisiable = true
      },
      /**
       * 删除操作
       * @param row
       */
      handleDelete(row) {
        this.$confirm('此操作将永久删除 <span class="text-danger">' + row.roleName + '</span>，是否继续?', '警告', {
          type: StatusType.WARNING,
          confirmButtonClass: 'el-button--warning'
        }).then(() => {
          this.$del('/system/role/deleteRole', {
            roleIds: row.roleId
          }).then(res => {
            respMsg(res, Msg.DELETE_SUCCESS, Msg.DELETE_FAILURE, () => {
              this.getList()
            })
          }).catch((error) => {
            console.log(error)
          });
        });
      },
      submitForm() {
        this.$refs.editFormRef.validate(valid => {
          if (valid) {
            // 数据校验成功，提交表单
            let loading = showLoading();
            this.$post("/system/role/saveRoleOne", this.editForm).then(res => {
              this.$nextTick(() => {
                loading.close();
              });
              respMsg(res, Msg.SAVE_SUCCESS, Msg.SAVE_FAILURE, () => {
                this.closeDialog()
                this.getList();
              })
            })
          }
        });
      },
      closeDialog() {
        this.formVisiable = false
        this.editForm = this.$options.data().editForm
        this.$refs.editFormRef.resetFields()
      },
      closePerDialog() {
        this.allotPerDlgVisiable = false
        this.permissionTree = this.$options.data().permissionTree
      }
    }
  }
</script>
