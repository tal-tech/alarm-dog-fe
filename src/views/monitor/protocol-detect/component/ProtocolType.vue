<template>
  <el-tag :type="protocolTypes[protocol]" :size="size">
    {{ PD_PROTOCOLS[protocol] }}
  </el-tag>
</template>

<script>
import {
  PD_PROTOCOLS,
  PD_PROTOCOL_HTTP,
  PD_PROTOCOL_TCP,
  PD_PROTOCOL_UDP,
  PD_PROTOCOL_DNS
} from '@/consts/monitor'

export default {
  name: 'ProtocolType',
  props: {
    protocol: {
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
      PD_PROTOCOLS,
      protocolTypes: {
        [PD_PROTOCOL_HTTP]: 'primary',
        [PD_PROTOCOL_TCP]: 'success',
        [PD_PROTOCOL_UDP]: 'warning',
        [PD_PROTOCOL_DNS]: 'danger'
      }
    }
  }
}
</script>
