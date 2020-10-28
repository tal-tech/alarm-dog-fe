<template>
  <div class="app-container">
    <div class="workflow-controls">
      <el-button
        v-if="[WORKFLOW_STATUS_PENDING, null].indexOf(workflow.status) > -1"
        type="primary"
        size="small"
        @click="handleClaim">认领</el-button>
      <el-button
        v-if="[WORKFLOW_STATUS_PROCESSING, null].indexOf(workflow.status) > -1"
        type="success"
        size="small"
        @click="handleProcessed">处理完成</el-button>
      <el-button
        v-if="[WORKFLOW_STATUS_CLOSED, null].indexOf(workflow.status) > -1"
        type="danger"
        size="small"
        @click="handleReactive">重新激活</el-button>
      <el-button
        v-if="[WORKFLOW_STATUS_PENDING, WORKFLOW_STATUS_PROCESSING, null].indexOf(workflow.status) > -1"
        type="warning"
        size="small"
        @click="handleAssign">指派</el-button>
      <el-button
        v-if="[WORKFLOW_STATUS_PENDING, WORKFLOW_STATUS_PROCESSING, null].indexOf(workflow.status) > -1"
        type="info"
        size="small"
        @click="handleClose">关闭</el-button>
    </div>
    <el-card class="box-card" style="margin-top: 15px">
      <div slot="header" class="clearfix">
        <span>工作流</span>
        <status-tag :status="workflow.status || WORKFLOW_STATUS_PENDING" size="mini" style="margin-left: 10px" />
      </div>
      <el-timeline>
        <el-timeline-item
          v-for="(pipe, index) in pipelines"
          :key="index"
          :timestamp="pipe.created_at | formatDate"
          placement="top">
          <div v-if="pipe.status == WORKFLOW_STATUS_PROCESSING" class="pipe-content" style="line-height: 40px">
            <code><user :creator="pipe.creator" /></code>
            认领了告警{{ pipe.remark ? `，并留言：${pipe.remark}` : '' }}
          </div>
          <div v-if="pipe.status == WORKFLOW_STATUS_PROCESSED" class="pipe-content" style="line-height: 40px">
            <code><user :creator="pipe.creator" /></code>
            处理完成了告警{{ pipe.remark ? `，并留言：${pipe.remark}` : '' }}
          </div>
          <div v-if="pipe.status == WORKFLOW_STATUS_REMIND" class="pipe-content" style="line-height: 40px">
            工作流因超过 <code>{{ pipe.props.remind.interval }}</code> 分钟
            <code>{{ remindStatuses[pipe.props.remind.status] }}</code>，触发了工作流通知
          </div>
          <div v-if="pipe.status == WORKFLOW_STATUS_CLOSED" class="pipe-content" style="line-height: 40px">
            <code><user :creator="pipe.creator" /></code>
            关闭了告警{{ pipe.remark ? `，并留言：${pipe.remark}` : '' }}
          </div>
          <div v-if="pipe.status == WORKFLOW_STATUS_REACTIVE" class="pipe-content" style="line-height: 40px">
            <code><user :creator="pipe.creator" /></code>
            重新激活了告警{{ pipe.remark ? `，并留言：${pipe.remark}` : '' }}
          </div>
          <div v-if="pipe.status == WORKFLOW_STATUS_ASSIGN" class="pipe-content" style="line-height: 40px">
            <code><user :creator="pipe.creator" /></code> 将任务指派给了
            <code v-for="(assignto, assignIndex) in pipe.props.assignto" :key="assignIndex">
              <user :creator="assignto" />
            </code>
            {{ pipe.remark ? `，并留言：${pipe.remark}` : '' }}
          </div>
        </el-timeline-item>

        <el-timeline-item v-if="history.id" :timestamp="workflow.created_at | formatDate" placement="top">
          <router-link :to="{ name: 'AlarmTaskShow', params: { taskId: history.task_id }}" target="_blank">
            <el-button type="text">
              {{ history.task ? history.task.name : `任务ID${history.task_id}` }}
            </el-button>
          </router-link>
          触发了告警
          <router-link :to="{ name: 'AlarmHistoryShow', params: { historyId: history.id }}">
            <el-button type="text">
              {{ history.uuid }}
            </el-button>
          </router-link>
        </el-timeline-item>
      </el-timeline>
    </el-card>

    <el-card class="box-card" style="margin-top: 35px">
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
          {{ history.task ? history.task.name : `任务ID${history.task_id}` }}
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

    <!-- 认领、关闭等 -->
    <el-dialog
      :title="processTitles[processStatus]"
      :visible.sync="dialogProcessVisible"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form class="form-container" label-width="120px" ref="form">
        <el-form-item label="工作流">
          <code v-for="row in selectedRows" :key="row.id">
            {{ row.id }}
          </code>
        </el-form-item>
        <el-form-item label="备注" prop="processRemark">
          <el-input v-model="processRemark" type="textarea"/>
        </el-form-item>
        <el-form-item v-if="processStatus == WORKFLOW_STATUS_ASSIGN" label="指派给" prop="processAssignTos">
          <add-members-select v-model="processAssignTos" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleProcess" :loading="formLoading">提交</el-button>
          <el-button @click="dialogProcessVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { showHistory } from '@/api/alarmhistory'
import { showWorkflow } from '@/api/workflow'
import { formatInObjectNumber } from '@/utils/helpers'
import { formatDate } from '@/utils/filters'
import VueJsonPretty from 'vue-json-pretty'
import clipboard from '@/directive/clipboard/index.js'
import {
  WORKFLOW_STATUS_PENDING,
  WORKFLOW_STATUS_PROCESSING,
  WORKFLOW_STATUS_PROCESSED,
  WORKFLOW_STATUS_CLOSED,
  WORKFLOW_STATUS_ASSIGN,
  WORKFLOW_STATUS_REACTIVE,
  WORKFLOW_STATUS_REMIND
} from '@/consts/alarm'
import ProcessHandleMixin from './mixins/process-handle'
import AddMembersSelect from '@/views/components/AddMembers/Select'
import User from '@/views/components/User'
import StatusTag from './components/StatusTag'
import LevelTag from '@/views/history/components/LevelTag'
import TypeTag from '@/views/history/components/TypeTag'

export default {
  name: 'AlarmWorkflowShow',
  mixins: [ProcessHandleMixin],
  components: { VueJsonPretty, AddMembersSelect, StatusTag, LevelTag, TypeTag, User },
  filters: { formatDate },
  directives: {
    clipboard
  },
  data () {
    return {
      workflowId: null,
      workflow: {},
      history: {},
      enableJsonFormat: true,
      pipelines: [],
      remindStatuses: {
        [WORKFLOW_STATUS_PENDING]: '未认领',
        [WORKFLOW_STATUS_PROCESSING]: '未处理完成'
      },
      WORKFLOW_STATUS_PENDING,
      WORKFLOW_STATUS_PROCESSING,
      WORKFLOW_STATUS_PROCESSED,
      WORKFLOW_STATUS_CLOSED,
      WORKFLOW_STATUS_ASSIGN,
      WORKFLOW_STATUS_REACTIVE,
      WORKFLOW_STATUS_REMIND
    }
  },
  computed: {
    selectedRows () {
      return [this.workflow]
    }
  },
  created () {
    this.workflowId = Number(this.$route.params.workflowId)
    this.getWorkflow()
  },
  methods: {
    // 获取工作流信息
    getWorkflow () {
      showWorkflow(this.workflowId)
        .then(res => {
          this.workflow = formatInObjectNumber(res.data.workflow, ['id', 'status', 'created_at', 'updated_at', 'task_id', 'history_id'])
          this.getHistory()
          this.pipelines = this.workflow.pipelines.sort((a, b) => b.created_at - a.created_at)
        })
    },
    // 获取告警记录
    getHistory () {
      showHistory(this.workflow.history_id)
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
    },
    // 成功时的操作
    handleSuccess (workflows) {
      workflows.forEach(workflow => {
        if (workflow.id == this.workflow.id) {
          this.$set(this.workflow, 'status', workflow.status)
        }
      })
    }
  }
}
</script>
