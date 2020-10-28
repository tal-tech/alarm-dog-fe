<template>
  <div>
    <el-form-item label="告警通知组">
      <add-alarm-groups-tag
        v-for="alarmGroup in receiver.alarmgroup"
        :key="alarmGroup.id"
        :group="alarmGroup"
        :closable="false"
        size="small"
      />
    </el-form-item>
    <detail-channels :channels="receiver.channels" />
  </div>
</template>

<script>
import AddAlarmGroupsTag from '@/views/components/AddAlarmGroups/Tag'
import DetailChannels from '@/views/alarm-manage/group/components/DetailChannels'

export default {
  name: 'ReceiverShow',
  components: { AddAlarmGroupsTag, DetailChannels },
  props: {
    receiver: {
      type: Object,
      required: true
    }
  }
}
</script>
