<template>
  <div class="component-div">
    <div class="form-div">
      <el-form :inline="true" align="left">
        <el-form-item class="form-operate">
          <el-button type="success" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="batchDelete()">批量删除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-div">
      <!-- 菜单列表 -->
      <table-pagination ref="tableRef" :tableConfig="tableConfig">
        <!--操作-->
        <template v-slot:operator="data">
          <el-button size="mini" @click="handleEdit(data.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteOne(data.row)">删除</el-button>
        </template>
      </table-pagination>
    </div>
  </div>
</template>

<script>
  import TablePagination from "../common/TablePagination";
  import {getAttrFromArray, joinMulti} from "../../util/common";
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
            // {type: 'selection', width: 40},
            {label: '菜单名称', prop: 'name'},
            {label: '权限码', prop: 'code'},
            {label: '图标', prop: 'icon'},
            {label: 'URL', prop: 'linKUrl'},
            {label: '操作', align: 'center', type: 'slot', slotName: 'operator'}
          ],
          pageable: false,
          treed: true,
          rowKey: 'id',
          orderName: 'iorder'
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
      handleEdit(id) {
        const h = this.$createElement;
        this.index++;
        let _self = this;
        const editFormRef = 'editFormRef';
        this.$msgbox({
          title: id ? '编辑' : '添加',
          message: h(MenuForm, {
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
          console.log(error)
        });
      },
      /**
       * 删除操作
       * @param row
       */
      handleDelete(ids, names) {
        let len = names.length;
        this.$confirm('此操作将永久删除 <span class="text-danger">' + joinMulti(names) + '</span> ' + (len > 3 ? '等' : '') + '共 <span class="text-danger">' + names.length + '</span> 条记录, 是否继续?', '警告', {
          type: StatusType.WARNING
        }).then(() => {
          this.$del('/system/menu/deleteMenu', {
            menuIds: joinMulti(ids)
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
        this.handleDelete([row.id], [row.name]);
      },
      batchDelete() {
        let selected = this.$refs.tableRef.selected;
        this.handleDelete(getAttrFromArray(selected, 'id'), getAttrFromArray(selected, 'menuName'))
      }
    }
  }
</script>
