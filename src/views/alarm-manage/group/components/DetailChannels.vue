<template>
  <div>
    <el-form-item
      v-for="(title, channel) in CHANNELS_USER"
      :key="channel"
      :label="title">
      <select-member-tag
        v-for="(row, index) in channels[channel]"
        :key="index"
        :member="row"
        :closable="false"
        size="small"
      />
    </el-form-item>
    <el-form-item :label="CHANNEL_YACHGROUP_TITLE">
      <div v-for="(row, index) in channels[CHANNEL_YACHGROUP]" :key="index" class="yachgroup-item" style="margin-top: 10px">
        <el-input v-model="row.webhook" size="small" readonly style="width: 49%; margin-right: 1%">
          <template slot="prepend">WebToken</template>
        </el-input>
        <el-input v-model="row.secret" size="small" readonly style="width: 49%">
          <template slot="prepend">Secret</template>
        </el-input>
      </div>
    </el-form-item>
    <el-form-item :label="CHANNEL_DINGGROUP_TITLE">
      <div v-for="(row, index) in channels[CHANNEL_DINGGROUP]" :key="index" class="dinggroup-item" style="margin-top: 10px">
        <el-input v-model="row.webhook" size="small" readonly style="width: 49%; margin-right: 1%">
          <template slot="prepend">WebToken</template>
        </el-input>
        <el-input v-model="row.secret" size="small" readonly style="width: 49%">
          <template slot="prepend">Secret</template>
        </el-input>
      </div>
      <div v-show="channels.dinggroupfocus && channels[CHANNEL_DINGGROUP].length" class="dinggroup-focus" style="margin-top: 10px">
        <el-input v-model="channels.dinggroupfocus" size="small" readonly>
          <template slot="prepend">关键词</template>
        </el-input>
      </div>
    </el-form-item>
    <el-form-item :label="CHANNEL_WEBHOOK_TITLE">
      {{ channels[CHANNEL_WEBHOOK] && channels[CHANNEL_WEBHOOK].url }}
    </el-form-item>
  </div>
</template>

<script>
import SelectMemberTag from '@/views/components/AddMembers/SelectMemberTag'
import {
  CHANNELS_USER,
  CHANNEL_DINGGROUP,
  CHANNEL_DINGGROUP_TITLE,
  CHANNEL_YACHGROUP,
  CHANNEL_YACHGROUP_TITLE,
  CHANNEL_WEBHOOK,
  CHANNEL_WEBHOOK_TITLE
} from '@/consts/alarm'

export default {
  name: 'AlarmGroupDetailChannels',
  components: { SelectMemberTag },
  props: {
    channels: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      CHANNELS_USER,
      CHANNEL_DINGGROUP,
      CHANNEL_DINGGROUP_TITLE,
      CHANNEL_YACHGROUP,
      CHANNEL_YACHGROUP_TITLE,
      CHANNEL_WEBHOOK,
      CHANNEL_WEBHOOK_TITLE
    }
  }
}
</script>
