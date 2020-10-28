<template>
  <div>
    <receiver-show :receiver="receiver" />
    <el-form-item label="分级告警">
      <template v-if="receiver.dispatch.length > 0">
        <el-tag :type="recvDispatchTypes[receiver.mode]" size="small">
          {{ RECV_DISPATCH_MODES[receiver.mode] }}
        </el-tag>
      </template>
      <template v-else>
        <el-tag type="warning" size="small">
          未开启分级告警功能
        </el-tag>
      </template>
    </el-form-item>
    <el-collapse v-if="receiver.dispatch.length > 0" v-model="modelCollapse" class="box-collapse" style="margin-bottom: 20px">
      <el-collapse-item
        v-for="(dispatch, index) in receiver.dispatch"
        :key="index"
        :name="`dispatch${index + 1}`">
        <template slot="title">
          分级告警{{ index + 1 }}
        </template>

        <el-form-item label="分级条件">
          <condition-show :conditions="dispatch.conditions" />
        </el-form-item>

        <el-form-item label="分级通知人">
          <receiver-show :receiver="dispatch.receiver" />
        </el-form-item>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import ReceiverShow from './ReceiverShow'
import ConditionShow from './ConditionShow'
import {
  RECV_DISPATCH_MODE_LAZY,
  RECV_DISPATCH_MODE_UNLAZY,
  RECV_DISPATCH_MODES
} from '@/consts/alarm'

export default {
  name: 'ReceiverModuleShow',
  components: { ReceiverShow, ConditionShow },
  props: {
    receiver: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      modelCollapse: [],
      RECV_DISPATCH_MODE_LAZY,
      RECV_DISPATCH_MODE_UNLAZY,
      RECV_DISPATCH_MODES,
      recvDispatchTypes: {
        [RECV_DISPATCH_MODE_LAZY]: 'success',
        [RECV_DISPATCH_MODE_UNLAZY]: 'primary'
      }
    }
  }
}
</script>
