<template>
  <el-tag v-if="status == WORKFLOW_STATUS_PENDING" type="danger" :size="size" effect="dark">
    待处理
  </el-tag>
  <el-tag v-else-if="status == WORKFLOW_STATUS_PROCESSING" type="primary" :size="size" effect="dark">
    处理中
  </el-tag>
  <el-tag v-else-if="status == WORKFLOW_STATUS_PROCESSED" type="success" :size="size" effect="dark">
    已完成
  </el-tag>
  <el-tag v-else-if="status == WORKFLOW_STATUS_CLOSED" type="info" :size="size" effect="dark">
    关闭
  </el-tag>
  <el-tag v-else type="info" :size="size" effect="dark">
    UNKNOWN({{ status }})
  </el-tag>
</template>

<script>
import {
  WORKFLOW_STATUS_PENDING,
  WORKFLOW_STATUS_PROCESSING,
  WORKFLOW_STATUS_PROCESSED,
  WORKFLOW_STATUS_CLOSED
} from '@/consts/alarm'

export default {
  name: 'StatusTag',
  props: {
    status: {
      type: Number,
      required: true
    },
    size: {
      type: String,
      default: 'medium'
    }
  },
  data () {
    return {
      WORKFLOW_STATUS_PENDING,
      WORKFLOW_STATUS_PROCESSING,
      WORKFLOW_STATUS_PROCESSED,
      WORKFLOW_STATUS_CLOSED
    }
  }
}
</script>
