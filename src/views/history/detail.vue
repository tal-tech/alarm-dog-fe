<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>告警信息</span>
      </div>
      <el-form v-if="history.id" class="form-container compact-form" label-width="120px" ref="form">
        <el-form-item label="告警ID">
          {{ history.id }}
        </el-form-item>
        <el-form-item label="UUID">
          {{ history.uuid }}
        </el-form-item>
        <el-form-item label="所属部门">
          {{ history.task && history.task.department ? history.task.department.name : `部门关联错误` }}
        </el-form-item>
        <el-form-item label="告警任务">
          <router-link :to="{ name: 'AlarmTaskShow', params: { taskId: history.task.id }}" target="_blank">
            <el-button type="text">
              {{ history.task ? history.task.name : `任务ID${history.task_id}` }}
            </el-button>
          </router-link>
        </el-form-item>
        <el-form-item label="收敛指标">
          {{ history.metric }}
        </el-form-item>
        <el-form-item label="收敛批次">
          {{ history.batch }}
        </el-form-item>
        <el-form-item label="告警级别">
          <level-tag :level="history.level" size="small" />
        </el-form-item>
        <el-form-item label="告警类型">
          <type-tag :alarmType="history.type" size="small" />
        </el-form-item>
        <el-form-item label="通知时间">
          {{ history.notice_time | formatDate }}
        </el-form-item>
        <el-form-item label="入库时间">
          {{ history.created_at | formatDate }}
        </el-form-item>
        <el-form-item label="告警内容">
          <div class="content-control">
            <el-button
              type="success"
              size="mini"
              v-clipboard:copy="provideCopyContent()"
              v-clipboard:success="copySuccess"
            >复制</el-button>
            <el-checkbox v-model="enableJsonFormat" border size="mini" style="margin-left: 20px">JSON格式化</el-checkbox>
          </div>
          <vue-json-pretty
            v-if="enableJsonFormat"
            :show-double-quotes="true"
            :show-length="false"
            :show-line="true"
            :highlight-mouseover-node="true"
            :collapsed-on-click-brackets="true"
            :data="history.ctn_json"
            style="line-height: 24px" />
          <div v-else style="line-height: 24px">
            {{ history.ctn }}
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- <el-card class="box-card" style="margin-top: 35px">
      <div slot="header" class="clearfix">
        <span>告警任务信息</span>
      </div>
       <el-form v-if="task.id" class="form-container compact-form" label-width="120px" ref="form">
        <el-form-item label="任务ID">
          {{ task.id }}
        </el-form-item>
      </el-form>
    </el-card> -->
  </div>
</template>

<script>
import { showHistory } from '@/api/alarmhistory'
import { formatDate, removeEmailSuffix } from '@/utils/filters'
import VueJsonPretty from 'vue-json-pretty'
import clipboard from '@/directive/clipboard/index.js'
import LevelTag from './components/LevelTag'
import TypeTag from './components/TypeTag'

export default {
  name: 'AlarmHistoryShow',
  components: { VueJsonPretty, LevelTag, TypeTag },
  filters: { formatDate, removeEmailSuffix },
  directives: {
    clipboard
  },
  data () {
    return {
      historyId: null,
      history: {},
      enableJsonFormat: true,
      task: {}
    }
  },
  created () {
    this.historyId = Number(this.$route.params.historyId)
    this.getHistory()
  },
  methods: {
    // 获取告警记录
    getHistory () {
      showHistory(this.historyId)
        .then(res => {
          this.history = this.formatHistory(res.data.history)
        })
    },
    // 格式化告警记录
    formatHistory (history) {
      history['id'] = Number(history['id'])
      history['level'] = Number(history['level'])
      history['created_at'] = Number(history['created_at'])
      try {
        history['ctn_json'] = JSON.parse(history['ctn'])
      } catch (e) {
        history['ctn_json'] = {}
      }
      return history
    },
    // 提供复制的内容
    provideCopyContent () {
      return this.enableJsonFormat ? JSON.stringify(this.history.ctn_json) : this.history.ctn
    },
    // 复制成功
    copySuccess () {
      this.$message.success('复制成功')
    }
  }
}
</script>
