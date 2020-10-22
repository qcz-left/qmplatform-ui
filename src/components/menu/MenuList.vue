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
      </table-pagination>
    </div>
    <!-- 菜单表单 -->
    <menu-form ref="menuFormRef"/>
  </div>
</template>

<script>
  import TablePagination from "../common/TablePagination";
  import {getAttrFromArray, joinMulti} from "../../util/common";
  import MenuForm from "./MenuForm";

  export default {
    name: "MenuList",
    components: {MenuForm, TablePagination},
    data() {
      return {
        tableConfig: {
          url: '/system/menu/getMenuList',
          queryParams: {
            menuName: ''
          },
          columns: [
            // {type: 'selection', width: 40},
            {label: '菜单名称', prop: 'name'},
            {label: '权限码', prop: 'code'},
            {label: '图标', prop: 'icon'},
            {label: 'URL', prop: 'linKUrl'}
          ],
          pageable: false,
          treed: true,
          rowKey: 'id',
          orderName: 'iorder'
        }
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
      handleEdit(row) {
        this.$refs.menuFormRef.openDialog(row);
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
          this.$del('/system/menu/delMenu', {
            menuIds: joinMulti(ids)
          }).then(res => {
            if (this.$respSuccess(res)) {
              this.$message.success('删除成功!');
              this.getList();
            } else {
              this.$message.error('删除失败!');
            }
          }).catch(() => {

          });
        });
      },
      deleteOne(row) {
        this.handleDelete([row.id], [row.menuName]);
      },
      batchDelete() {
        let selected = this.$refs.tableRef.selected;
        this.handleDelete(getAttrFromArray(selected, 'id'), getAttrFromArray(selected, 'menuName'))
      }
    }
  }
</script>

<style scoped>

</style>
