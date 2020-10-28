<template>
  <el-tag v-if="level == LEVEL_NOTICE" type="info" :size="size" effect="dark">
    {{ levels[level] }}
  </el-tag>
  <el-tag v-else-if="level == LEVEL_WARN" type="warning" :size="size" effect="dark">
    {{ levels[level] }}
  </el-tag>
  <el-tag v-else-if="level == LEVEL_ERROR" type="danger" :size="size">
    {{ levels[level] }}
  </el-tag>
  <el-tag v-else-if="level == LEVEL_CRITI" type="danger" :size="size" effect="dark">
    {{ levels[level] }}
  </el-tag>
  <el-tag v-else type="info" :size="size" effect="dark">
    UNKNOWN({{ level }})
  </el-tag>
</template>

<script>
import {
  LEVEL_NOTICE,
  LEVEL_WARN,
  LEVEL_ERROR,
  LEVEL_CRITI,
  levels
} from '@/consts/alarm'

export default {
  name: 'LevelTag',
  props: {
    level: {
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
      LEVEL_NOTICE,
      LEVEL_WARN,
      LEVEL_ERROR,
      LEVEL_CRITI,
      levels
    }
  }
}
</script>
