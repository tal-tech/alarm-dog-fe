<template>
  <el-tag v-if="enable" type="success" effect="dark" :size="size">开启</el-tag>
  <el-tag v-else type="warning" effect="dark" :size="size">关闭</el-tag>
</template>

<script>
export default {
  name: 'EnableStatusTag',
  props: {
    enable: {
      type: [Number, Boolean],
      required: true
    },
    size: {
      type: String,
      default: 'small'
    }
  }
}
</script>
