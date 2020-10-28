<template>
  <el-tag :type="tagTypes[type]" :size="size">
    {{ DS_TYPES[type] }}
  </el-tag>
</template>

<script>
import {
  DS_TYPE_ES,
  DS_TYPE_MYSQL,
  DS_TYPE_KAFKA,
  DS_TYPE_WEBHOOK,
  DS_TYPES
} from '@/consts/monitor'

export default {
  name: 'DatasourceType',
  props: {
    type: {
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
      DS_TYPES,
      tagTypes: {
        [DS_TYPE_WEBHOOK]: 'info',
        [DS_TYPE_KAFKA]: 'success',
        [DS_TYPE_MYSQL]: 'primary',
        [DS_TYPE_ES]: 'warning'
      }
    }
  }
}
</script>
