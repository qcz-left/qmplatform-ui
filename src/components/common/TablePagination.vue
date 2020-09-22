<template>
  <div>
    <el-table :data="tableConfig.tableData" border stripe
              v-loading="tableConfig ? tableConfig.loading : false">
      <template v-for="(column, index) in tableConfig.columns">
        <el-table-column
          v-if="column.type == 'slot'"
          :index="index"
          :type="column.type"
          :prop="column.prop"
          :sortable="column.sortable"
          :label="column.label"
          :width="column.width ? column.width : 'auto'"
          :align="column.align">
          <template slot-scope="scope">
            <slot :name="column.slotName" :row="scope.row" :value="scope.row[column.prop]"></slot>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :index="index"
          :type="column.type"
          :prop="column.prop"
          :sortable="column.sortable"
          :label="column.label"
          :width="column.width ? column.width : 'auto'"
          :align="column.align">
        </el-table-column>
      </template>
    </el-table>
    <el-pagination
      :align="tableConfig.paginationAlign ? tableConfig.paginationAlign : 'right'"
      @size-change="tableConfig.handleSizeChange"
      @current-change="tableConfig.handleCurrentChange"
      :current-page="tableConfig.currentPage ? tableConfig.currentPage : 1"
      :page-sizes="tableConfig.pageSizes ? tableConfig.pageSizes : [10, 50, 200, 1000]"
      :page-size="tableConfig.pageSize ? tableConfig.pageSize : 10"
      :layout="tableConfig.layout ? tableConfig.layout : 'total, sizes, prev, pager, next, jumper'"
      :total="tableConfig.total ? tableConfig.total : tableConfig.tableData.length">
    </el-pagination>
  </div>
</template>

<script>
  import {get} from '../../util/http'

  export default {
    name: "TablePagination",
    props: ['tableConfig'],
    data() {
      return {}
    },
    methods: {
      getList() {
        this.$parent.tableConfig.loading = true;
        get(this.$parent.tableConfig.url, this.$parent.tableConfig.queryParams).then(res => {
          this.$parent.tableConfig.tableData = res.data.list;
          this.$parent.tableConfig.total = res.data.count;
          this.$parent.tableConfig.loading = false;
        })
      }
    },
    created() {
      this.getList();
    }
  }
</script>

<style lang="less" scoped>

</style>
