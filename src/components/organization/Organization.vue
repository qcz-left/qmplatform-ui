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
          <el-button size="mini" @click="handleEdit(data.row.id, data.row.name)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteOne(data.row)">删除</el-button>
        </template>
      </table-pagination>
    </div>

    <!--表单-->
    <el-dialog
      :title="dialogTitle"
      :visible="formVisiable"
      v-if="formVisiable"
      width="30%"
      @close="closeDialog"
      v-dialog-drag>
      <el-form :model="editForm" :rules="rules" label-position="right" label-width="100px" ref="editFormRef">
        <el-form-item label="部门名称" prop="organizationName">
          <el-input v-model="editForm.organizationName"/>
        </el-form-item>
        <el-form-item label="部门编码">
          <el-input v-model="editForm.organizationCode"/>
        </el-form-item>
        <el-form-item label="所属上级" prop="parentId">
          <tree-select v-model="editForm.parentId"
                       :url="treeOption.url"
                       :queryParams="treeOption.queryParams"
                       :accordion="true"/>
        </el-form-item>
        <el-form-item label="排序">
          <el-input type="number" v-model="editForm.iorder"/>
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
  </div>
</template>

<script>
  import {Msg, StatusType} from "../../util/constant";
  import {respMsg} from "../../util/common";
  import TablePagination from "../common/TablePagination";
  import TreeSelect from "../common/TreeSelect";
  import {showLoading} from "../../util/loading";

  export default {
    name: "Organization",
    components: {TablePagination, TreeSelect},
    data() {
      return {
        tableConfig: {
          url: '/system/organization/getOrgList',
          columns: [
            {label: '部门名称', prop: 'name'},
            {label: '部门编码', prop: 'code'},
            {label: '操作', align: 'center', type: 'slot', slotName: 'operator'}
          ],
          pageable: false,
          treed: true,
          rowKey: 'id',
          orderName: 'name'
        },
        editForm: {
          organizationId: '',
          parentId: '',
          organizationName: '',
          organizationCode: '',
          remark: '',
          iorder: 0
        },
        treeOption: {
          url: '/system/organization/getOrgList',
          queryParams: {
            organizationId: ''
          }
        },
        rules: {
          organizationName: [
            {required: true, message: '请输入部门名称'}
          ]
        },
        dialogTitle: '',
        formVisiable: false
      }
    },
    methods: {
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
          this.treeOption.queryParams.organizationId = id
          this.$get('/system/organization/getOrgOne/' + id, {}).then(result => {
            this.editForm = result.data;
          });
        } else {
          this.dialogTitle = '添加'
        }
        this.formVisiable = true
      },
      submitForm() {
        this.$refs.editFormRef.validate(valid => {
          if (valid) {
            // 数据校验成功，提交表单
            let loading = showLoading();
            this.$post("/system/organization/saveOrgOne", this.editForm).then(res => {
              loading.close();
              respMsg(res, Msg.SAVE_SUCCESS, Msg.SAVE_FAILURE, () => {
                this.closeDialog()
                this.getList();
              })
            })
          }
        });
      },
      /**
       * 删除操作
       * @param row
       */
      handleDelete(id, name) {
        this.$confirm('此操作将永久删除 <span class="text-danger">' + name + '</span> , 是否继续?', '警告', {
          type: StatusType.WARNING,
          confirmButtonClass: 'el-button--warning'
        }).then(() => {
          this.$del('/system/organization/deleteOrg', {
            organizationId: id
          }).then(res => {
            respMsg(res, Msg.DELETE_SUCCESS, Msg.DELETE_FAILURE, () => {
              this.getList()
            })
          });
        }).catch((error) => {
          console.log(error)
        });
      },
      deleteOne(row) {
        this.handleDelete(row.id, row.name);
      },
      closeDialog() {
        this.formVisiable = false
        this.editForm = this.$options.data().editForm
        this.$refs.editFormRef.resetFields()
      }
    }
  }
</script>
