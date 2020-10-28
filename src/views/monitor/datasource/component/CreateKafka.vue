<template>
  <div>
    <el-form-item label="代理地址" prop="consumer_proxy">
      <el-input v-model="config.consumer_proxy" placeholder="只能填写一个，以http://或者https://开头" />
    </el-form-item>
    <el-form-item label="Topic" prop="topic">
      <el-input v-model="config.topic" placeholder="kafka主题" />
    </el-form-item>
  </div>
</template>

<script>
import { isUrl } from '@/utils/validate'

export default {
  name: 'DatasourceCreateKafka',
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
        consumer_proxy: '',
        topic: ''
      }
      this.$emit('set-config', config)
    },
    // 格式化填充表单
    initEditForm (config) {
      return {
        consumer_proxy: config.consumer_proxy,
        topic: config.topic
      }
    },
    // 验证表单
    validForm () {
      if (!this.config.consumer_proxy) {
        throw new Error('Kafka消费代理地址必填')
      }
      if (!isUrl(this.config.consumer_proxy)) {
        throw new Error('Kafka消费代理地址必须为有效URL地址')
      }
      if (!this.config.topic) {
        throw new Error('Kafka主题topic必填')
      }
    },
    // 获取表单数据
    getFormData () {
      this.validForm()
      return {
        consumer_proxy: this.config.consumer_proxy,
        topic: this.config.topic
      }
    }
  }
}
</script>
