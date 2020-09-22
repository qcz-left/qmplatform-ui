<template>
  <div class="component-div">
    <el-table :data="tableData" border stripe
              v-loading="loading"
              @sort-change="sortChange">
      <template v-for="(column, index) in tableConfig.columns">
        <el-table-column
          v-if="column.type == 'slot'"
          :index="index"
          :type="column.type"
          :prop="column.prop"
          :sortable="column.sortable ? 'custom' : false"
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
          :sortable="column.sortable ? 'custom' : false"
          :label="column.label"
          :width="column.width ? column.width : 'auto'"
          :align="column.align"
          :formatter="column.formatter">
        </el-table-column>
      </template>
    </el-table>
    <el-pagination
      v-if="typeof(tableConfig.pageable) == 'boolean' && !tableConfig.pageable ? false : true"
      :align="tableConfig.paginationAlign ? tableConfig.paginationAlign : 'right'"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :layout="layout"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import {get} from '../../util/http'

  export default {
    name: "TablePagination",
    props: ['tableConfig'],
    data() {
      return {
        tableData: [],
        loading: this.$parent.tableConfig.loading || false,
        currentPage: this.$parent.tableConfig.currentPage ? this.$parent.tableConfig.currentPage : 1,
        pageSizes: this.$parent.tableConfig.pageSizes ? this.$parent.tableConfig.pageSizes : [10, 50, 200, 1000],
        pageSize: this.$parent.tableConfig.pageSize ? this.$parent.tableConfig.pageSize : 10,
        layout: this.$parent.tableConfig.layout ? this.$parent.tableConfig.layout : 'total, sizes, prev, pager, next, jumper',
        total: 0,
        orderName: '',
        order: ''
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList(reset) {
        this.loading = true;
        let queryParams = this.$parent.tableConfig.queryParams;
        if (reset) {
          this.currentPage = 1;
          this.pageSize = this.$parent.tableConfig.pageSize ? this.$parent.tableConfig.pageSize : 10;
          this.orderName = '';
          this.order = '';
        }
        queryParams.page = this.currentPage;
        queryParams.limit = this.pageSize;
        queryParams.orderName = this.orderName;
        queryParams.order = this.order;
        get(this.$parent.tableConfig.url, queryParams).then(res => {
          this.tableData = res.data.list;
          this.total = res.data.count;
          this.loading = false;
        })
      },
      handleSizeChange(size) {
        this.pageSize = size;
        this.getList();
      },
      handleCurrentChange(page) {
        this.currentPage = page;
        this.getList();
      },
      sortChange(config) {
        this.orderName = config.prop;
        this.order = config.order == 'ascending' ? 'asc' : (config.order == 'descending' ? 'desc' : '');
        this.getList();
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-pagination {
    padding: 10px;
  }

  .el-table {
    height: 93%;
  }
</style>
