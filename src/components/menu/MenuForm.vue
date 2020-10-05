<template>
  <div>
    <el-dialog
      v-loading="loading"
      element-loading-text="正在保存数据..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :title="dialogTitle"
      :visible="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="closeDialog"
      width="30%"
      v-if="centerDialogVisible"
      center>
      <el-form :model="editForm" :rules="rules" label-position="right" label-width="100px" ref="editFormRef">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="editForm.menuName" clearable/>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentId">
          <el-input v-model="editForm.parentId"/>
        </el-form-item>
        <el-form-item label="权限码" prop="code">
          <el-input v-model="editForm.code" clearable/>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="editForm.icon" clearable/>
        </el-form-item>
        <el-form-item label="URL" prop="linkUrl">
          <el-input v-model="editForm.linkUrl" clearable/>
        </el-form-item>
        <el-form-item label="排序" prop="iorder">
          <el-input type="number" v-model="editForm.iorder"/>
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
  export default {
    name: "MenuForm",
    data() {
      return {
        // 弹窗标题
        dialogTitle: '',
        centerDialogVisible: false,
        // 表单提交遮罩
        loading: false,
        // 表单编辑参数
        editForm: {
          menuName: '',
          parentId: '',
          code: '',
          linkUrl: '',
          iorder: 0
        },
        // 表单校验规则
        rules: {}
      }
    },
    methods: {
      /**
       * 提交表单
       */
      submitForm() {
        this.$refs.editFormRef.validate(valid => {
          if (valid) {
            // 数据校验成功，提交表单
            this.loading = true;
            if (this.editForm.id) {
              this.$put("/system/menu/updateMenu", this.editForm).then(res => {
                this.submitResp(res);
              })
            } else {
              this.$post('/system/menu/addMenu', this.editForm).then(res => {
                this.submitResp(res);
              })
            }
          }
        });
      },
      /**
       * 表单提交后的响应
       */
      submitResp(res) {
        this.loading = false;
        if (this.$respSuccess(res)) {
          this.$message.success("保存成功！");
          // 关闭弹窗
          this.closeDialog();
          // 刷新列表数据
          this.$parent.getList();
        } else {
          this.$message.error("保存失败！");
        }
      },
      /**
       * 打开时填充表单
       */
      openDialog(data) {
        this.centerDialogVisible = true;
        if (data) {
          // 设置弹窗标题
          this.dialogTitle = '编辑菜单【' + data.menuName + '】';
          // 编辑，拷贝row中的值到editForm
          Object.assign(this.editForm, data)
        } else {
          // 新增
          this.dialogTitle = '添加菜单';
        }
      },
      /**
       * 关闭时重置
       */
      closeDialog() {
        this.$nextTick(() => {
          this.$refs.editFormRef.resetFields();
        });
        this.centerDialogVisible = false;
        this.editForm = this.$options.data().editForm;
      }
    }
  }
</script>

<style scoped>

</style>
