<template>
  <div>
    <!-- 用户表单 -->
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" clearable/>
        </el-form-item>
        <el-form-item label="登录名" prop="loginname">
          <el-input v-model="editForm.loginname" :disabled="disableProp.loginname" clearable/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input onfocus="this.type='password'" v-model="editForm.password" clearable/>
        </el-form-item>
        <el-form-item label="确认密码" prop="passwordConfirm">
          <el-input onfocus="this.type='password'" v-model="editForm.passwordConfirm" clearable/>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="editForm.userSex" placeholder="请选择">
            <el-option v-for="item in optUserSex" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="editForm.phone" clearable/>
        </el-form-item>
        <el-form-item label="邮箱" prop="emailAddr">
          <el-input v-model="editForm.emailAddr" clearable/>
        </el-form-item>
        <el-form-item label="备注">
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
  import {validEmail, validPhone} from "../../util/validate";
  import {get} from '../../util/http'
  import {respSuccess} from "../../util/common";

  export default {
    name: "UserForm",
    data() {
      const validLoginName = async (rule, value, callback) => {
        const res = await get('/system/user/validateLoginName', {
          loginname: value,
          userId: this.editForm.id
        });
        if (respSuccess(res)) {
          callback();
        } else {
          callback(new Error('登录名已存在，请重新输入！'))
        }
      };
      const validPasswordConfirm = (rule, value, callback) => {
        if (value == this.editForm.password) {
          callback()
        } else {
          callback(new Error('两次密码输入不一样，请重新输入！'))
        }
      };
      return {
        // 弹窗标题
        dialogTitle: '',
        centerDialogVisible: false,
        // 表单提交遮罩
        loading: false,
        // 性别下拉框数据
        optUserSex: [
          {value: '1', label: '男'},
          {value: '2', label: '女'}
        ],
        // 表单编辑参数
        editForm: {
          id: '',
          username: '',
          loginname: '',
          password: '',
          passwordConfirm: '',
          oldPassword: '',
          userSex: '',
          phone: '',
          emailAddr: '',
          remark: ''
        },
        // 表单校验规则
        rules: {
          username: [
            {required: true, message: '请输入用户名'}
          ],
          loginname: [
            {required: true, message: '请输入登录名'},
            {min: 3, max: 15, message: '长度在 3 到 15 个字符'},
            {validator: validLoginName, trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码'}
          ],
          passwordConfirm: [
            {required: true, message: '请输入确认密码'},
            {
              validator: validPasswordConfirm, trigger: 'blur'
            }
          ],
          phone: [
            {required: true, validator: validPhone, trigger: 'blur'}
          ],
          emailAddr: [
            {required: true, validator: validEmail, trigger: 'blur'}
          ]
        },
        // 禁用属性
        disableProp: {
          loginname: false
        }
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
              this.$put("/system/user/updateUser", this.editForm).then(res => {
                this.submitResp(res);
              })
            } else {
              this.$post('/system/user/addUser', this.editForm).then(res => {
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
          this.dialogTitle = '编辑用户【' + data.username + '】';
          // 不允许修改登录名
          this.disableProp.loginname = true;
          // 编辑，拷贝row中的值到editForm
          data.oldPassword = data.password;
          data.password = '******';
          data.passwordConfirm = '******';
          Object.assign(this.editForm, data)
        } else {
          // 新增
          this.dialogTitle = '添加用户';
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
        this.disableProp = this.$options.data().disableProp;
      }
    }
  }
</script>
