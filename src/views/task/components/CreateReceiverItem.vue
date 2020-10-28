<template>
  <div>
    <el-form-item label="告警通知组">
      <add-alarm-groups-select v-model="receiver.alarmgroup" />
    </el-form-item>

    <el-collapse class="single-collapse" style="margin-bottom: 20px">
      <el-collapse-item name="udf">
        <template slot="title">
          自定义告警通知渠道
          <el-tooltip placement="top" style="margin-left: 5px">
            <div slot="content">
              单击该栏可以展开自定义配置告警通知渠道 <br>
              建议您配置告警通知组，更方便管理，操作更便捷
            </div>
            <i class="el-icon-question condition-item-tooltips" />
          </el-tooltip>

          <span style="color: #F56C6C; margin-left: 10px">点我展开配置临时告警通知渠道</span>
        </template>
        <alarm-group-channel-create
          ref="channelCreate"
          v-model="receiver.channels"
          :showDinggroupFocus="showGroupFocus" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import AddAlarmGroupsSelect from '@/views/components/AddAlarmGroups/Select'
import AlarmGroupChannelCreate from '@/views/alarm-manage/group/components/ChannelCreate'
import {
  CHANNELS,
  CHANNEL_WEBHOOK
} from '@/consts/alarm'

export default {
  name: 'CreateReceiverItem',
  components: {
    AddAlarmGroupsSelect, AlarmGroupChannelCreate
  },
  model: {
    prop: 'receiver'
  },
  props: {
    receiver: {
      type: Object,
      required: true
    },
    showGroupFocus: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    }
  },
  methods: {
    // 格式化receiver表单
    getFormData (receiver, withGroupFocus = false) {
      const form = {
        alarmgroup: receiver.alarmgroup.map(g => g.id),
        channels: this.$refs.channelCreate.getFormData(receiver.channels, withGroupFocus)
      }

      return form
    },
    // 初始化填充receiver字段
    initForm (receiver, withDinggroupFocus = false) {
      const initForm = {
        alarmgroup: receiver.alarmgroup || [],
        channels: {}
      }

      // 处理自定义通知渠道
      Object.keys(CHANNELS).forEach(channel => {
        initForm.channels[channel] = receiver.channels && receiver.channels[channel]
          ? receiver.channels[channel]
          : (channel == CHANNEL_WEBHOOK ? { url: '' } : [])
      })

      // 处理dinggroup focus
      if (withDinggroupFocus) {
        initForm.channels['dinggroupfocus'] = receiver.channels['dinggroupfocus'] || null
        initForm.channels['enableDinggroupFocus'] = !!receiver.channels['dinggroupfocus']
      }

      return initForm
    }
  }
}
</script>
