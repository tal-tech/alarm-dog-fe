<template>
  <div style="display: inline-block">
    <el-popover
      placement="bottom"
      width="500"
      class="group-tag"
      trigger="hover"
      :open-delay="300"
    >
      <div class="popover-info">
        <div class="popover-info-item text-ellipsis">
          <span class="popover-info-item-title">
            ID：
          </span>
          {{ group.id }}
        </div>
        <div class="popover-info-item text-ellipsis">
          <span class="popover-info-item-title">
            告警组：
          </span>
          {{ group.name }}
        </div>
        <div v-if="group.remark" class="popover-info-item text-ellipsis">
          <span class="popover-info-item-title">
            备注：
          </span>
          {{ group.remark }}
        </div>
      </div>
      <el-tag
        slot="reference"
        class="group-tag-btn"
        :closable="closable"
        :size="size"
        @close="$emit('close-tag')"
        @click="handleShowGroup"
      >
        {{ group.name }}
      </el-tag>
    </el-popover>

    <!-- 告警组详细信息 -->
    <el-dialog
      title="告警组详情"
      :visible.sync="dialogShowGroup"
      width="60%"
    >
      <div class="filter-container clearfix">
        <div class="filter-container-right clearfix">
          <router-link tag="a" target="_blank" :to="{ name: 'AlarmGroupEdit', params: { groupId: group.id }}">
            <el-button type="primary" size="small">编辑</el-button>
          </router-link>
          <router-link tag="a" target="_blank" :to="{ name: 'AlarmGroupSaveAs', params: { groupId: group.id }}">
            <el-button type="primary" size="small">另存为</el-button>
          </router-link>
        </div>
      </div>
      <alarm-group-detail :alarm-group="alarmGroup" />
    </el-dialog>
  </div>
</template>

<script>
import AlarmGroupDetail from '@/views/alarm-manage/group/components/Detail'
import { showGroup } from '@/api/alarmgroup'
import { formatInObjectNumber } from '@/utils/helpers'

export default {
  name: 'AddAlarmGroupsTag',
  components: { AlarmGroupDetail },
  props: {
    group: {
      type: Object,
      required: true
    },
    closable: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'default'
    }
  },
  data () {
    return {
      dialogShowGroup: false,
      alarmGroup: {}
    }
  },
  methods: {
    // 显示告警组详情
    handleShowGroup () {
      showGroup(this.group.id)
        .then(res => {
          this.alarmGroup = formatInObjectNumber(res.data.alarmgroup, ['id', 'created_at'])
          this.dialogShowGroup = true
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.group-tag {
  margin-right: 10px;
  .group-tag-btn {
    cursor: pointer;
  }
}
// popover 信息块
.popover-info {
    .popover-info-item {
        position: relative;
        line-height: 2.2;
        padding-left: 72px;

        .popover-info-item-title {
            position: absolute;
            left: 0;
            display: inline-block;
            width: 60px;
            font-weight: 600;
        }
    }
}
</style>
