<template>
  <div>
    <!-- 用户表单 -->
    <el-dialog
      :title="dialogTitle"
      :visible="centerDialogVisible"
      @close="closeDialog"
      width="30%"
      v-dialog-drag
      v-if="centerDialogVisible">
      <el-form :model="editForm" :rules="rules" label-position="right" label-width="100px" ref="editFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username"/>
        </el-form-item>
        <el-form-item label="所属部门">
          <tree-select v-model="editForm.organizationIds"
                       :url="treeOption.url"
                       :queryParams="treeOption.queryParams"
                       :accordion="true"/>
        </el-form-item>
        <el-form-item label="登录名" prop="loginname">
          <el-input v-model="editForm.loginname" :disabled="disableProp.loginname"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input onfocus="this.type='password'" v-model="editForm.password"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="passwordConfirm">
          <el-input onfocus="this.type='password'" v-model="editForm.passwordConfirm"/>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="editForm.userSex" placeholder="请选择">
            <el-option v-for="item in optUserSex" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="editForm.phone"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="emailAddr">
          <el-input v-model="editForm.emailAddr"/>
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
  import {respMsg, respSuccess} from "../../util/common";
  import {Common, Msg} from "../../util/constant";
  import {showLoading} from "../../util/loading";
  import TreeSelect from "../common/TreeSelect";

  export default {
    name: "UserForm",
    components: {TreeSelect},
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
        if (value === this.editForm.password) {
          callback()
        } else {
          callback(new Error('两次密码输入不一样，请重新输入！'))
        }
      };
      return {
        // 弹窗标题
        dialogTitle: '',
        centerDialogVisible: false,
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
          remark: '',
          organizationIds: ''
        },
        treeOption: {
          url: '/system/organization/getOrgList'
        },
        // 表单校验规则
        rules: {
          username: [
            {required: true, message: '请输入用户名'}
          ],
          loginname: [
            {required: true, message: '请输入登录名'},
            {min: 3, max: 10, message: '长度在 3 到 15 个字符'},
            {validator: validLoginName, trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码'},
            {min: 3, max: 20, message: '长度在 3 到 20 个字符'}
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
            let loading = showLoading();
            this.editForm.organizationIds = [this.editForm.organizationIds]
            this.$post('/system/user/saveUser', this.editForm).then(res => {
              this.$nextTick(() => {
                loading.close();
              });
              respMsg(res, Msg.SAVE_SUCCESS, Msg.SAVE_FAILURE, () => {
                // 关闭弹窗
                this.closeDialog();
                // 刷新列表数据
                this.$parent.getList();
              })
            })
          }
        });
      },
      /**
       * 打开时填充表单
       */
      openDialog(id, name) {
        this.centerDialogVisible = true;
        if (id) {
          // 设置弹窗标题
          this.dialogTitle = '编辑用户 - ' + name;
          // 不允许修改登录名
          this.disableProp.loginname = true;
          // 编辑，拷贝row中的值到editForm
          this.$get('/system/user/getUser/' + id, {}).then(data => {
            data.oldPassword = data.password;
            data.password = Common.UN_CHANGED_PASSWORD;
            data.passwordConfirm = Common.UN_CHANGED_PASSWORD;
            this.editForm = data;
            if (this.editForm.organizationIds) {
              this.editForm.organizationIds = this.editForm.organizationIds[0]
            }
          });
        } else {
          // 新增
          this.dialogTitle = '添加用户';
        }
      },
      /**
       * 关闭时重置
       */
      closeDialog() {
        this.centerDialogVisible = false;
        this.editForm = this.$options.data().editForm;
        this.disableProp = this.$options.data().disableProp;
      }
    }
  }
</script>
