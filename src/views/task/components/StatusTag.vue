<template>
  <el-tag v-if="status == 1" type="success" :size="size" effect="dark">
    <slot>运行中</slot>
  </el-tag>
  <el-tag v-else-if="status == 2" type="warning" :size="size" effect="dark">
    <slot>已暂停</slot>
  </el-tag>
  <el-tag v-else-if="status == 0" type="danger" :size="size" effect="dark">
    <slot>已停止</slot>
  </el-tag>
  <el-tag v-else type="info" :size="size" effect="dark">
    <slot>UNKNOWN({{ status }})</slot>
  </el-tag>
</template>

<script>
export default {
  name: 'StatusTag',
  props: {
    status: {
      type: Number,
      required: true
    },
    size: {
      type: String,
      default: 'default'
    }
  }
}
</script>
