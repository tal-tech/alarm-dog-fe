<template>
  <span v-if="creator">
    {{ creator.username }} ({{ creator.email | removeEmailSuffix }})
  </span>
  <span v-else>
    用户关联错误
  </span>
</template>

<script>
import { removeEmailSuffix } from '@/utils/filters'

export default {
  name: 'User',
  props: {
    creator: {
      type: Object,
      default: () => { return {} }
    }
  },
  filters: { removeEmailSuffix }
}
</script>
