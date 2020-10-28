<template>
  <div class="app-container">
    <el-form class="form-container compact-form" label-width="120px" ref="form">
      <el-form-item label="工号">
        {{ user.uid }}
      </el-form-item>
      <el-form-item label="姓名">
        {{ user.username }}
      </el-form-item>
      <el-form-item label="邮箱">
        {{ user.email }}
      </el-form-item>
      <el-form-item label="手机号">
        {{ user.phone }}
        <el-button size="mini" type="primary" style="margin-left: 30px" @click="confirmUpdatePhone">修改手机号</el-button>
      </el-form-item>
      <el-form-item label="部门">
        {{ user.department }}
      </el-form-item>
    </el-form>

    <el-dialog title="修改手机号" :visible.sync="dialogUpdatePhone">
      <el-form :form="formUpdatePhone" label-width="120px">
        <el-form-item label="手机号">
          <el-input v-model="formUpdatePhone.phone" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdatePhone = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdatePhone">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { profile, updatePhone } from '@/api/user'

export default {
  name: 'UserProfile',
  data () {
    return {
      user: {},
      dialogUpdatePhone: false,
      formUpdatePhone: {
        phone: null
      }
    }
  },
  created () {
    this.getProfile()
  },
  methods: {
    // 获取用户信息
    getProfile () {
      profile()
        .then(res => {
          this.user = res.data.user
        })
    },
    // 确认修改手机号的风险
    confirmUpdatePhone () {
      this.$confirm('因错发告警短信或者错拨告警电话可能导致敏感信息泄露、客户投诉，请确保填写正确的手机号，乱填写必追究相应责任，所有修改手机号记录将永久保存', '风险提示', {
        confirmButtonText: '我知道了',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.phone = this.formUpdatePhone.phone
        this.dialogUpdatePhone = true
      }).catch(() => {
        this.$message.info('已取消更改手机号')
      })
    },
    // 修改手机号
    handleUpdatePhone () {
      updatePhone(this.formUpdatePhone.phone)
        .then(res => {
          this.$set(this.user, 'phone', this.formUpdatePhone.phone)
          this.$message.success('修改成功')
          this.dialogUpdatePhone = false
        })
    }
  }
}
</script>
