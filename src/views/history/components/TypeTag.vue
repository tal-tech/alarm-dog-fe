<template>
  <el-tag v-if="alarmType == ALARM_TYPE_NORMAL" type="primary" :size="size" effect="dark">
    {{ alarmTypes[alarmType] }}
  </el-tag>
  <el-tag v-else-if="alarmType == ALARM_TYPE_RECOVERY" type="primary" :size="size" effect="dark">
    {{ alarmTypes[alarmType] }}
  </el-tag>
  <el-tag v-else-if="alarmType == ALARM_TYPE_IGNORE" type="warning" :size="size" effect="dark">
    {{ alarmTypes[alarmType] }}
  </el-tag>
  <el-tag v-else type="info" :size="size" effect="dark">
    UNKNOWN({{ alarmType }})
  </el-tag>
</template>

<script>
import {
  ALARM_TYPE_NORMAL,
  ALARM_TYPE_RECOVERY,
  ALARM_TYPE_IGNORE,
  alarmTypes
} from '@/consts/alarm'

export default {
  name: 'TypeTag',
  props: {
    alarmType: {
      type: Number,
      required: true
    },
    size: {
      type: String,
      default: 'default'
    }
  },
  data () {
    return {
      ALARM_TYPE_NORMAL,
      ALARM_TYPE_RECOVERY,
      ALARM_TYPE_IGNORE,
      alarmTypes
    }
  }
}
</script>
