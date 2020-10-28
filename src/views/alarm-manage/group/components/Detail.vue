<template>
  <el-form v-if="alarmGroup.id" class="form-container compact-form" label-width="120px" ref="form">
    <el-form-item label="ID">
      {{ alarmGroup.id }}
    </el-form-item>
    <el-form-item label="告警组名称">
      {{ alarmGroup.name }}
    </el-form-item>
    <el-form-item label="备注">
      {{ alarmGroup.remark }}
    </el-form-item>
    <el-form-item label="创建时间">
      {{ alarmGroup.created_at | formatDate }}
    </el-form-item>
    <el-form-item label="创建人">
      <template v-if="alarmGroup.creator">
        <user :creator="alarmGroup.creator" />
      </template>
      <template v-else>
        用户关联错误
      </template>
    </el-form-item>
    <detail-channels :channels="alarmGroup.receiver.channels" />
  </el-form>
</template>

<script>
import { formatDate, removeEmailSuffix } from '@/utils/filters'
import DetailChannels from './DetailChannels'
import User from '@/views/components/User'

export default {
  name: 'AlarmGroupDetail',
  components: { DetailChannels, User },
  props: {
    alarmGroup: {
      type: Object,
      required: true
    }
  },
  filters: { formatDate, removeEmailSuffix }
}
</script>
