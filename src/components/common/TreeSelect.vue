<template>
  <el-select ref="selectRef" v-model="valueTitle" :clearable="clearable" @clear="clearHandle" :multiple="multiple" :remove-tag="removeTag">
    <el-option :value="valueTitle" :label="valueTitle" class="options">
      <el-tree
        id="tree-option"
        ref="selectTree"
        check-strictly
        :show-checkbox="multiple"
        :accordion="accordion"
        :data="treeData"
        :props="props"
        :node-key="props.value"
        :default-expanded-keys="defaultExpandedKey"
        @node-click="handleNodeClick"
        @check="checked">
      </el-tree>
    </el-option>
  </el-select>
</template>

<script>
  export default {
    name: "tree-select",
    props: {
      // 配置项
      props: {
        type: Object,
        default: () => ({
          value: 'id',
          label: 'name',
          children: 'childes'
        })
      },

      // 选项列表数据(树形结构的对象数组)
      options: {type: Array, default: () => []},

      // 初始值
      value: {type: [String, Array], default: null},

      // 可清空选项
      clearable: {type: Boolean, default: true},

      // 自动收起
      accordion: {type: Boolean, default: false},
      // 远程加载数据url
      url: {type: String, default: null},
      queryParams: {
        type: Object,
        default: () => ({})
      },
      // 多选
      multiple: {type: Boolean, default: false}
    },
    data() {
      return {
        treeData: this.options,
        valueId: null,
        valueTitle: null,
        defaultExpandedKey: []
      }
    },
    mounted() {
      if (this.url) {
        this.$get(this.url, this.queryParams).then(result => {
          this.treeData = result.data;
          this.initHandle();
        });
      } else {
        this.initHandle()
      }
    },
    methods: {
      removeTag(tag) {
        console.log(tag)
      },
      checked(checked, allChecked) {
        this.$emit('input', allChecked.checkedKeys);
        let checkedNodes = allChecked.checkedNodes;
        let checkedName = []
        checkedNodes.forEach(node => {
          checkedName.push(node.name)
        })
        this.valueTitle = checkedName
        // this.$emit('onSelect', checked.checkedKeys);
      },
      // 初始化值
      initHandle() {
        if (this.valueId) {
          this.$nextTick(() => {
            let node = this.$refs.selectTree.getNode(this.valueId);
            if (node) {
              this.valueTitle = node.data[this.props.label]     // 初始化显示
              this.$refs.selectTree.setCurrentKey(this.valueId)       // 设置默认选中
              this.$refs.selectRef.blur();
            }
          })
        }
        this.initScroll()
      },
      // 初始化滚动条
      initScroll() {
        this.$nextTick(() => {
          let scrollWrap = document.querySelectorAll('.el-scrollbar .el-select-dropdown__wrap')[0]
          let scrollBar = document.querySelectorAll('.el-scrollbar .el-scrollbar__bar')
          scrollWrap.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;'
          scrollBar.forEach(ele => ele.style.width = 0)
        })
      },
      // 切换选项
      handleNodeClick(node) {
        if (this.multiple) {
          return
        }
        this.valueTitle = node[this.props.label]
        this.valueId = node[this.props.value]
        this.$emit('input', this.valueId)
        this.defaultExpandedKey = [];
      },
      // 清除选中
      clearHandle() {
        this.valueTitle = ''
        this.valueId = null
        this.defaultExpandedKey = []
        this.clearSelected()
        this.$emit('input', null)
      },
      // 清空选中样式
      clearSelected() {
        let allNode = document.querySelectorAll('#tree-option .el-tree-node')
        allNode.forEach((element) => element.classList.remove('is-current'))
      }
    },
    watch: {
      value() {
        this.valueId = this.value;
        this.initHandle();
      }
    }
  }
</script>

<style scoped>
  .el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
    height: auto;
    max-height: 274px;
    padding: 0;
    overflow: hidden;
    overflow-y: auto;
  }

  .el-select-dropdown__item.selected {
    font-weight: normal;
  }

  ul li >>> .el-tree .el-tree-node__content {
    height: auto;
    padding: 0 20px;
  }

  .el-tree-node__label {
    font-weight: normal;
  }

  .el-tree >>> .is-current .el-tree-node__label {
    color: #409EFF;
    font-weight: 700;
  }

  .el-tree >>> .multiple-default {
    color: unset;
    font-weight: unset;
  }

  .el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
    color: #606266;
    font-weight: normal;
  }
</style>
