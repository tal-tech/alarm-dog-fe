<template>
  <span>
    <span class="hidden-token">{{ showToken }}</span>
    <el-button v-if="hiddenToken" type="warning" size="mini" @click="hiddenToken = false">显示</el-button>
    <el-button v-if="!hiddenToken" type="primary" size="mini" @click="hiddenToken = true">隐藏</el-button>
    <el-button type="success" size="mini" v-clipboard:copy="token" v-clipboard:success="copySuccess">复制</el-button>
    <el-button type="danger" size="mini" @click="$emit('reset')">重置</el-button>
  </span>
</template>

<script>
import clipboard from '@/directive/clipboard/index.js'

export default {
  name: 'HiddenToken',
  props: {
    token: {
      type: String,
      required: true
    }
  },
  directives: {
    clipboard
  },
  data () {
    return {
      hiddenToken: false
    }
  },
  computed: {
    showToken () {
      if (!this.hiddenToken) {
        return this.token
      }
      return this.token.split('').map((char, index) => {
        if (index >= 4 && index <= this.token.length - 5) {
          return '*'
        } else {
          return char
        }
      }).join('')
    }
  },
  created () {
    this.hiddenToken = true
  },
  methods: {
    // 复制成功
    copySuccess () {
      this.$message.success('复制成功')
    }
  }
}
</script>

<style lang="scss" scoped>
.hidden-token {
  font-family: Consolas,"Courier New",Courier,FreeMono,monospace;
  display: inline-block;
  width: 42ch;
  font-size: 16px;
}
</style>
