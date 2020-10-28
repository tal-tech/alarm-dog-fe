<template>
  <div>
    <el-form-item label="节点地址" prop="nodes">
      <el-input v-model="config.nodes" placeholder="多个节点地址以,分隔，ip或域名:端口格式" />
    </el-form-item>
    <el-form-item label="索引" prop="index">
      <el-input v-model="config.index" placeholder="ES索引，可使用变量占位符，请查看label标签帮助提示" />
    </el-form-item>
  </div>
</template>

<script>
import { isIP, isDomain } from '@/utils/validate'

export default {
  name: 'DatasourceCreateElasticSearch',
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
        nodes: '',
        index: ''
      }
      this.$emit('set-config', config)
    },
    // 格式化填充表单
    initEditForm (config) {
      const nodes = config.nodes.map(node => `${node.host}:${node.port}`).join(',')

      return {
        nodes,
        index: config.index
      }
    },
    // 验证表单
    validForm () {
      if (!this.config.nodes) {
        throw new Error('ElasticSearch节点地址必填')
      }
      if (!this.config.index) {
        throw new Error('ElasticSearch索引必填')
      }
    },
    // 获取表单数据
    getFormData () {
      this.validForm()

      const nodes = this.config.nodes.split(/,|，/).map(node => {
        const nodeConf = node.split(':')
        if (!isIP(nodeConf[0]) && !isDomain(nodeConf[0])) {
          throw new Error('ElasticSearch节点地址必须是IP或者域名+端口的格式')
        }
        if (nodeConf[1] && isNaN(parseInt(nodeConf[1]))) {
          throw new Error('ElasticSearch节点地址必须是IP或者域名+端口的格式')
        }
        return { host: nodeConf[0], port: nodeConf[1] ? parseInt(nodeConf[1]) : 80 }
      })

      return {
        nodes,
        index: this.config.index
      }
    }
  }
}
</script>
