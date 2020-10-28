<template>
  <el-tag :type="tagTypes[type]" :size="size">
    {{ templateTypes[type] }}
  </el-tag>
</template>

<script>
import {
  templateTypes,
  TEMPLATE_TYPE_DEFAULT,
  TEMPLATE_TYPE_PREDEFINED,
  TEMPLATE_TYPE_CUSTOM
} from '@/consts/alarm'

export default {
  name: 'TemplateType',
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
      templateTypes,
      tagTypes: {
        [TEMPLATE_TYPE_DEFAULT]: 'info',
        [TEMPLATE_TYPE_PREDEFINED]: 'success',
        [TEMPLATE_TYPE_CUSTOM]: 'primary'
      }
    }
  }
}
</script>
