<template>
  <div>
    <el-form-item label="MySQL Host" prop="host">
      <el-input v-model="config.host" placeholder="填写只读地址即可" />
    </el-form-item>
    <el-form-item label="MySQL Port" prop="port">
      <el-input v-model="config.port" placeholder="填写只读地址端口即可" />
    </el-form-item>
    <el-form-item label="库名" prop="database">
      <el-input v-model="config.database" placeholder="数据库名称" />
    </el-form-item>
    <el-form-item label="表名" prop="table">
      <el-input v-model="config.table" placeholder="数据表名称" />
    </el-form-item>
    <el-form-item label="用户名" prop="username">
      <el-input v-model="config.username" placeholder="MySQL只读用户名，为空则使用哮天犬的MySQL只读帐号，请联系开通权限" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="config.password" placeholder="MySQL只读用户密码，为空则使用哮天犬的MySQL只读帐号密码，请联系开通权限" />
    </el-form-item>
  </div>
</template>

<script>
import { isIP, isDomain } from '@/utils/validate'

export default {
  name: 'CreateMysql',
  model: {
    prop: 'config'
  },
  props: {
    config: {
      type: Object,
      default: () => { return {} }
    }
  },
  data () {
    return {

    }
  },
  created () {
    this.initEmptyForm()
  },
  methods: {
    // 初始化配置
    initEmptyForm () {
      const config = {
        host: '',
        port: '',
        database: '',
        table: '',
        username: '',
        password: ''
      }
      this.$emit('set-config', config)
    },
    // 格式化填充表单
    initEditForm (config) {
      return {
        host: config.host,
        port: config.port,
        database: config.database,
        table: config.table,
        username: config.username || '',
        password: config.password || ''
      }
    },
    // 验证表单
    validForm () {
      if (!this.config.host) {
        throw new Error('MySQL Host必填')
      }
      if (!isIP(this.config.host) && !isDomain(this.config.host)) {
        throw new Error('MySQL Host必须是一个IP或者域名')
      }
      if (!this.config.port) {
        throw new Error('MySQL Port必填')
      }
      if (isNaN(parseInt(this.config.port))) {
        throw new Error('MySQL Port必须是数字')
      }
    },
    // 获取表单数据
    getFormData () {
      this.validForm()
      return {
        host: this.config.host,
        port: this.config.port,
        database: this.config.database,
        table: this.config.table,
        username: this.config.username || null,
        password: this.config.password || null
      }
    }
  }
}
</script>
