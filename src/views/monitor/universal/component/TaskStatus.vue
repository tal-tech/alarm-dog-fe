<template>
  <el-tag :type="statusTypes[status]" :size="size">
    {{ TASK_STATUSES[status] }}
  </el-tag>
</template>

<script>
import {
  TASK_STATUS_STARTING,
  TASK_STATUS_STARTED,
  TASK_STATUS_STOPPING,
  TASK_STATUS_STOPPED,
  TASK_STATUS_EDITED,
  TASK_STATUSES
} from '@/consts/monitor'

export default {
  name: 'TaskStatus',
  props: {
    status: {
      type: Number,
      required: true
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data () {
    return {
      TASK_STATUSES,
      statusTypes: {
        [TASK_STATUS_STARTING]: 'primary',
        [TASK_STATUS_STARTED]: 'success',
        [TASK_STATUS_STOPPING]: 'warning',
        [TASK_STATUS_STOPPED]: 'danger',
        [TASK_STATUS_EDITED]: 'info'
      }
    }
  }
}
</script>
