<template>
  <div>
    <el-form :model="editForm" :rules="rules" label-position="right" label-width="120px" ref="editFormRef">
      <el-form-item label="菜单/按钮名称" prop="permissionName">
        <el-input v-model="editForm.permissionName"/>
      </el-form-item>
      <el-form-item label="权限类型" prop="permissionType">
        <el-select v-model="editForm.permissionType" placeholder="请选择" :disabled="disableProp.permissionType">
          <el-option v-for="item in options.permissionType" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="所属上级" prop="parentId">
        <tree-select v-model="editForm.parentId"
                     :options="menuTree"
                     :clearable="true"
                     :accordion="true"/>
      </el-form-item>
      <el-form-item label="权限码" prop="code">
        <el-input v-model="editForm.code"/>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input v-model="editForm.icon"/>
      </el-form-item>
      <el-form-item label="URL" prop="linkUrl">
        <el-input v-model="editForm.linkUrl"/>
      </el-form-item>
      <el-form-item label="排序" prop="iorder">
        <el-input type="number" v-model="editForm.iorder"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {showLoading} from "../../util/loading";
  import {Msg} from "../../util/constant";
  import TreeSelect from "../common/TreeSelect";

  export default {
    name: "MenuForm",
    components: {TreeSelect},
    data() {
      return {
        // 弹窗标题
        dialogTitle: '',
        centerDialogVisible: false,
        // 表单编辑参数
        editForm: {
          permissionId: '',
          permissionName: '',
          parentId: '',
          code: '',
          linkUrl: '',
          iorder: 0,
          permissionType: ''
        },
        menuTree: [],
        // 表单校验规则
        rules: {
          permissionName: [
            {required: true, message: '请输入菜单/按钮名称'}
          ],
          parentId: [],
          code: [],
          linkUrl: [],
          iorder: [],
          permissionType: []
        },
        options: {
          permissionType: [
            {value: 1, label: '菜单'},
            {value: 2, label: '按钮'}
          ]
        },
        // 禁用属性
        disableProp: {
          permissionType: false
        }
      }
    },
    async created() {
      let permissionId = this.$parent.data.permissionId;
      if (permissionId) {
        this.disableProp.permissionType = true;
        this.$get('/system/menu/getPermissionOne/' + permissionId, {}).then(result => {
          this.editForm = result.data;
        });
      }
      let {result: data} = await this.$get('/system/menu/getMenuList', {
        permissionType: 1
      });
      this.menuTree = data;
    },
    methods: {
      getValue(value) {
        this.editForm.parentId = value;
      },
      /**
       * 提交表单
       */
      submitForm(_list, done) {
        this.$refs.editFormRef.validate(valid => {
          if (valid) {
            // 数据校验成功，提交表单
            let loading = showLoading();
            this.$post("/system/menu/savePermissionOne", this.editForm).then(res => {
              this.$nextTick(() => {
                loading.close();
              });
              let success = this.$respSuccess(res);
              if (success) {
                this.$message.success(Msg.SAVE_SUCCESS);
                done();
                // 刷新列表数据
                _list.getList();
              } else {
                this.$message.error(Msg.SAVE_FAILURE);
              }
            })
          }
        });
      }
    }
  }
</script>
