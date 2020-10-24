<template>
  <div>
    <el-form :model="editForm" :rules="rules" label-position="right" label-width="120px" ref="editFormRef">
      <el-form-item label="菜单/按钮名称" prop="menuName">
        <el-input v-model="editForm.menuName"/>
      </el-form-item>
      <el-form-item label="权限类型" prop="permissionType">
        <el-select v-model="editForm.permissionType" placeholder="请选择">
          <el-option v-for="item in options.permissionType" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="所属上级" prop="parentId">
        <el-input v-model="editForm.parentId"/>
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

  export default {
    name: "MenuForm",
    data() {
      return {
        // 弹窗标题
        dialogTitle: '',
        centerDialogVisible: false,
        // 表单编辑参数
        editForm: {
          menuId: '',
          menuName: '',
          parentId: '',
          code: '',
          linkUrl: '',
          iorder: 0,
          permissionType: ''
        },
        // 表单校验规则
        rules: {
          menuName: [
            {required: true, message: '请输入菜单名称'}
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
        }
      }
    },
    created() {
      let permissionId = this.$parent.data.permissionId;
      if (permissionId) {
        this.$get('/system/menu/getPermissionOne/' + permissionId, {}).then(result => {
          this.editForm = result.data;
        });
      }
    },
    methods: {
      /**
       * 提交表单
       */
      submitForm(_list, done) {
        this.$refs.editFormRef.validate(valid => {
          if (valid) {
            // 数据校验成功，提交表单
            let loading = showLoading();
            this.$post("/system/menu/saveMenuOne", this.editForm).then(res => {
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
