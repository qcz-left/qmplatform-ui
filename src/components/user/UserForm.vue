<template>
  <div>
    <!-- 用户表单 -->
    <el-dialog
      title="添加用户"
      :visible.sync="centerDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="30%"
      center>
      <el-form :model="editForm" :rules="rules" label-position="right" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" clearable/>
        </el-form-item>
        <el-form-item label="登录名" prop="loginname">
          <el-input v-model="editForm.loginname" clearable/>
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
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>

<script>
  import {validEmail, validPhone} from "../../util/validate";

  export default {
    name: "UserForm",
    data() {
      return {
        editForm: {
          username: '',
          loginname: '',
          userSex: '',
          phone: '',
          emailAddr: '',
          remark: ''
        },
        optUserSex: [
          {value: '1', label: '男'},
          {value: '2', label: '女'}
        ],
        rules: {
          username: [
            {required: true, message: '请填写用户名'}
          ],
          loginname: [
            {required: true, message: '请填写登录名'},
            {min: 3, max: 5, message: '长度在 3 到 5 个字符'}
          ],
          phone: [
            {required: true, validator: validPhone, trigger: 'blur'}
          ],
          emailAddr: [
            {required: true, validator: validEmail, trigger: 'blur'}
          ]
        }
      }
    }
  }
</script>
