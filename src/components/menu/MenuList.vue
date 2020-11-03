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
      <!-- 菜单列表 -->
      <table-pagination ref="tableRef" :tableConfig="tableConfig">
        <!--操作-->
        <template v-slot:operator="data">
          <el-button size="mini" @click="handleEdit(data.row.id, data.row.name)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteOne(data.row)">删除</el-button>
        </template>
        <template v-slot:permissionType="data">
          <el-tag v-if="data.value == 1">菜单</el-tag>
          <el-tag type="danger" v-else>按钮</el-tag>
        </template>
      </table-pagination>
    </div>
  </div>
</template>

<script>
  import TablePagination from "../common/TablePagination";
  import MenuForm from "./MenuForm";
  import {Msg, MsgBoxAction, StatusType} from "../../util/constant";

  export default {
    name: "MenuList",
    components: {MenuForm, TablePagination},
    data() {
      return {
        tableConfig: {
          url: '/system/menu/getMenuList',
          columns: [
            {prop: 'permissionType', type: 'slot', width: 70, slotName: 'permissionType'},
            {label: '菜单/按钮名称', prop: 'name'},
            {label: '权限码', prop: 'code'},
            {label: '图标', prop: 'icon'},
            {label: 'URL', prop: 'linkUrl'},
            {label: '操作', align: 'center', type: 'slot', slotName: 'operator'}
          ],
          pageable: false,
          treed: true,
          rowKey: 'id'
        },
        index: 1
      }
    },
    methods: {
      doSearchList() {
        this.getList();
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
        this.index++;
        let _self = this;
        const editFormRef = 'editFormRef';
        this.$msgbox({
          title: id ? '编辑 - ' + name: '添加',
          message: this.$createElement(MenuForm, {
            key: this.index,
            ref: editFormRef
          }),
          data: {
            permissionId: id
          },
          beforeClose: function (action, instance, done) {
            if (action === MsgBoxAction.CONFIRM) {
              _self.$refs[editFormRef].submitForm(_self, done);
            } else {
              done();
            }
          }
        }).catch((error) => {

        });
      },
      /**
       * 删除操作
       * @param row
       */
      handleDelete(id, name, type) {
        this.$confirm('此操作将永久删除 <span class="text-danger">' + name + '</span> , 是否继续?', '警告', {
          type: StatusType.WARNING,
          confirmButtonClass: 'el-button--warning'
        }).then(() => {
          let delUrl;
          if (type == '1') {
            delUrl = '/system/menu/deleteMenu';
          } else {
            delUrl = '/system/button/deleteButton';
          }
          this.$del(delUrl, {
            permissionIds: id
          }).then(res => {
            if (this.$respSuccess(res)) {
              this.$message.success(Msg.DELETE_SUCCESS);
              this.getList();
            } else {
              this.$message.error(Msg.DELETE_FAILURE);
            }
          }).catch(() => {

          });
        });
      },
      deleteOne(row) {
        this.handleDelete(row.id, row.name, row.permissionType);
      }
    }
  }
</script>
