<template>
  <div class="app-container">
    <el-form v-if="task.id" class="form-container compact-form" label-width="120px" ref="form">
      <sticky :sticky-top="70">
        <div class="task-controls" style="background: #fff; padding-bottom: 20px">
          <el-button
            type="primary"
            size="small"
            @click="$router.push({ name: 'AlarmTaskEdit', params: { taskId: task.id } })">
            编辑
          </el-button>
          <el-button type="primary" size="small" @click="handleSaveAs(task)">另存为</el-button>
          <el-button type="primary" size="small" @click="handleReportAlarm(task)">发送告警</el-button>
          <el-button
            type="primary"
            size="small"
            @click="$router.push({ name: 'AlarmHistory', query: { taskid: task.id } })">
            告警记录
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="$router.push({ name: 'AlarmWorkflow', query: { taskid: task.id } })">
            工作流处理
          </el-button>
          <el-button
            v-if="task.status !== TASK_STATUS_RUNNING"
            type="success"
            size="small"
            @click="handleStart(task)">
            启动
          </el-button>
          <el-button
            v-if="task.status !== TASK_STATUS_PAUSE"
            type="warning"
            size="small"
            @click="handlePause(task)">
            暂停
          </el-button>
          <el-button
            v-if="task.status !== TASK_STATUS_STOPPED"
            type="danger"
            size="small"
            @click="handleStop(task)">
            停止
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(task)">删除</el-button>
        </div>
      </sticky>

      <el-card class="container-card container-basic">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
        </div>
        <el-form-item label="任务ID">
          {{ task.id }}
        </el-form-item>
        <el-form-item label="任务名称">
          {{ task.name }}
        </el-form-item>
        <el-form-item label="token">
          <hidden-token :token="task.token" @reset="resetToken" />
          <a :href="`${manual}alarm/alarm-api.html`" target="_blank" style="margin-left: 10px">
            <el-button type="primary" size="mini">告警接口</el-button>
          </a>
          <a :href="`${manual}sdk/summary-alarm.html`" target="_blank" style="margin-left: 10px">
            <el-button type="primary" size="mini">告警SDK</el-button>
          </a>
        </el-form-item>
        <el-form-item label="secret">
          <hidden-token :token="task.secret" @reset="resetSecret" />
          <a :href="`${manual}openapi/introduction.html`" target="_blank" style="margin-left: 10px">
            <el-button type="primary" size="mini">开放平台</el-button>
          </a>
        </el-form-item>
        <el-form-item label="阿里云告警">
          <el-tooltip class="item" effect="dark" :content="apis.aliyun" placement="top">
            <span class="api-url">{{ apis.aliyun.substr(0, 38) + '…' }}</span>
          </el-tooltip>
          <el-button type="success" size="mini" v-clipboard:copy="apis.aliyun" v-clipboard:success="copySuccess">复制</el-button>
          <el-button type="primary" size="mini" @click="gotoApiUrlDocs('aliyun')">使用说明</el-button>
        </el-form-item>
        <el-form-item label="Grafana告警">
          <el-tooltip class="item" effect="dark" :content="apis.grafana" placement="top">
            <span class="api-url">{{ apis.grafana.substr(0, 38) + '…' }}</span>
          </el-tooltip>
          <el-button type="success" size="mini" v-clipboard:copy="apis.grafana" v-clipboard:success="copySuccess">复制</el-button>
          <el-button type="primary" size="mini" @click="gotoApiUrlDocs('grafana')">使用说明</el-button>
        </el-form-item>
        <el-form-item label="falcon告警">
          <el-tooltip class="item" effect="dark" :content="apis.falcon" placement="top">
            <span class="api-url">{{ apis.falcon.substr(0, 38) + '…' }}</span>
          </el-tooltip>
          <el-button type="success" size="mini" v-clipboard:copy="apis.falcon" v-clipboard:success="copySuccess">复制</el-button>
          <el-button type="primary" size="mini" @click="gotoApiUrlDocs('falcon')">使用说明</el-button>
        </el-form-item>
        <el-form-item label="阿里云arms">
          <el-tooltip class="item" effect="dark" :content="apis.arms" placement="top">
            <span class="api-url">{{ apis.arms.substr(0, 38) + '…' }}</span>
          </el-tooltip>
          <el-button type="success" size="mini" v-clipboard:copy="apis.arms" v-clipboard:success="copySuccess">复制</el-button>
          <el-button type="primary" size="mini" @click="gotoApiUrlDocs('arms')">使用说明</el-button>
        </el-form-item>
        <el-form-item label="JsonBody">
          <el-tooltip class="item" effect="dark" :content="apis.jsonbody" placement="top">
            <span class="api-url">{{ apis.jsonbody.substr(0, 38) + '…' }}</span>
          </el-tooltip>
          <el-button type="success" size="mini" v-clipboard:copy="apis.jsonbody" v-clipboard:success="copySuccess">复制</el-button>
          <el-button type="primary" size="mini" @click="gotoApiUrlDocs('jsonbody')">使用说明</el-button>
        </el-form-item>
        <el-form-item label="部门">
          {{ task.department ? task.department.name : '部门关联失败' }}
        </el-form-item>
        <el-form-item label="标签">
          <select-alarm-tag
            v-for="(tag, index) in task.task_tags"
            :key="index"
            :tag="tag"
            :closable="false"
            size="small"
          />
        </el-form-item>
        <el-form-item label="任务状态">
          <status-tag :status="task.status" size="medium"></status-tag>
        </el-form-item>
        <el-form-item label="告警入库存储">
          <el-tag v-if="task.flag_save_db " type="success" size="small">入库存储</el-tag>
          <el-tag v-else type="warning" size="small">不入库存储</el-tag>
        </el-form-item>
        <el-form-item label="读写权限">
          <select-member-tag
            v-for="(row, index) in task.permission.rw"
            :key="index"
            :member="row"
            :closable="false"
            size="small"
          />
        </el-form-item>
        <el-form-item label="只读权限">
          <select-member-tag
            v-for="(row, index) in task.permission.ro"
            :key="index"
            :member="row"
            :closable="false"
            size="small"
          />
        </el-form-item>
      </el-card>

      <el-card class="container-card container-receiver">
        <div slot="header" class="clearfix">
          <span>告警通知人</span>
        </div>
        <receiver-module-show :receiver="task.receiver" />
      </el-card>

      <el-card class="container-card container-workflow">
        <div slot="header" class="clearfix">
          <span>告警工作流</span>
        </div>
        <el-form-item label="状态">
          <enable-status-tag :enable="task.workflow.enable" />
        </el-form-item>
        <template v-if="task.workflow.enable">
          <el-form-item label="提醒">
            <el-collapse
              v-for="(remind, index) in task.workflow.reminds"
              :key="index"
              class="box-collapse"
              style="margin-bottom: 20px">
              <el-collapse-item>
                <template slot="title">
                  <el-tag v-if="remind.mode === 'cycle'" type="success" effect="dark" size="small">周期循环</el-tag>
                  <el-tag v-else-if="remind.mode === 'once'" type="primary" effect="dark" size="small">单次提醒</el-tag>
                  <workflow-status :status="remind.status" size="small" style="margin: 0 5px 0 15px"/>
                  状态时告警发送之后 <code>{{ remind.interval }}</code> 分钟无人处理，将通知：
                  <el-tag v-if="remind.reuse_receiver" type="success" effect="dark" size="small">复用告警通知人</el-tag>
                  <el-tag v-else type="primary" effect="dark" size="small">自定义告警通知人</el-tag>
                </template>
                <receiver-show :receiver="remind.reuse_receiver ? task.receiver : remind.receiver" />
              </el-collapse-item>
            </el-collapse>
          </el-form-item>
        </template>
      </el-card>

      <el-card class="container-card container-filter">
        <div slot="header" class="clearfix">
          <span>告警过滤</span>
        </div>
        <el-form-item label="状态">
          <enable-status-tag :enable="task.filter.enable" />
        </el-form-item>
        <template v-if="task.filter.enable">
          <el-form-item label="未命中过滤">
            {{ task.filter.not_match ? '直接入库' : '丢弃告警' }}
          </el-form-item>
          <el-form-item label="过滤模式">
            {{ task.filter.mode == 1 ? '白名单模式' : '黑名单模式' }}
          </el-form-item>
          <el-form-item label="过滤条件">
            <condition-show :conditions="task.filter.conditions" />
          </el-form-item>
        </template>
      </el-card>

      <el-card class="container-card container-compress">
        <div slot="header" class="clearfix">
          <span>告警收敛</span>
        </div>
        <el-form-item label="状态">
          <enable-status-tag :enable="task.compress.enable" />
        </el-form-item>
        <template v-if="task.compress.enable">
          <el-form-item label="未命中收敛">
            {{ task.compress.not_match ? '直接发送' : '丢弃告警' }}
          </el-form-item>
          <el-form-item label="收敛方式">
            <div>
              <el-tag type="success" effect="dark" size="small">
                {{ compressMethods[task.compress.method] || 'UNKNOWN' }}
              </el-tag>
            </div>
            <condition-show v-if="task.compress.method === COMPRESS_METHOD_CONDITION" :conditions="task.compress.conditions" />
          </el-form-item>
          <el-form-item label="收敛策略">
            <template v-if="task.compress.strategy == 1">
              <el-tag type="success" effect="dark" size="small">周期收敛</el-tag>
              <code>{{ task.compress.strategy_cycle }}</code> 分钟后开始下一轮收敛周期
            </template>
            <template v-if="task.compress.strategy == 2">
              <el-tag type="success" effect="dark" size="small">延迟收敛</el-tag>
              延迟 <code>{{ task.compress.strategy_cycle }}</code> 分钟后发送告警统计报告
            </template>
            <template v-if="task.compress.strategy == 3">
              <el-tag type="success" effect="dark" size="small">周期次数收敛</el-tag>
              <code>{{ task.compress.strategy_cycle }}</code> 分钟内告警达到 <code>{{ task.compress.strategy_count }}</code> 条之后开始下一轮周期
            </template>
            <template v-if="task.compress.strategy == 4">
              <el-tag type="success" effect="dark" size="small">次数周期收敛</el-tag>
              <code>{{ task.compress.strategy_cycle }}</code> 分钟内告警达到 <code>{{ task.compress.strategy_count }}</code> 条之后才发送告警，并开始下一轮周期
              <el-tag type="warning" size="small">不安全收敛策略</el-tag>
            </template>
            <template v-if="task.compress.strategy == 5">
              <el-tag type="success" effect="dark" size="small">次数收敛</el-tag>
              <code>{{ task.compress.strategy_cycle }}</code> 分钟内告警达到 <code>{{ task.compress.strategy_count }}</code> 条之后才发送告警，并不重置周期
              <el-tag type="danger" size="small">极其不安全收敛策略</el-tag>
            </template>
          </el-form-item>
        </template>
      </el-card>

      <el-card class="container-card container-upgrade">
        <div slot="header" class="clearfix">
          <span>告警升级</span>
        </div>
        <el-form-item label="状态">
          <enable-status-tag :enable="task.upgrade.enable" />
        </el-form-item>
        <template v-if="task.upgrade.enable">
          <el-form-item label="升级策略">
            <el-collapse
              v-for="(strategy, index) in task.upgrade.strategies"
              :key="index"
              class="box-collapse"
              style="margin-bottom: 20px">
              <el-collapse-item>
                <template slot="title">
                  <code>{{ strategy.interval }}</code> 分钟内告警达到 <code>{{ strategy.count }}</code> 条后，告警升级为
                  <level-tag :level="strategy.level" size="small" style="margin: 0 5px"/>，将通知：
                  <el-tag v-if="strategy.reuse_receiver" type="success" effect="dark" size="small">复用告警通知人</el-tag>
                  <el-tag v-else type="primary" effect="dark" size="small">自定义告警通知人</el-tag>
                </template>
                <receiver-show :receiver="strategy.reuse_receiver ? task.receiver : strategy.receiver" />
              </el-collapse-item>
            </el-collapse>
          </el-form-item>
        </template>
      </el-card>

      <el-card class="container-card container-recovery">
        <div slot="header" class="clearfix">
          <span>自动恢复</span>
        </div>
        <el-form-item label="状态">
          <enable-status-tag :enable="task.recovery.enable" />
        </el-form-item>
        <template v-if="task.recovery.enable">
          <el-form-item label="恢复方式">
            <template v-if="task.recovery.mode == 1">
              <div>
                <el-tag type="primary" effect="dark" size="small">条件恢复</el-tag>
              </div>
              <condition-show :conditions="task.recovery.conditions" />
            </template>
            <template v-else-if="task.recovery.mode == 2">
              <el-tag type="primary" effect="dark" size="small">延迟恢复</el-tag>
              <code>{{ task.recovery.delay_interval }}</code> 分钟内未收到新的告警，告警将自动恢复
            </template>
          </el-form-item>
        </template>
      </el-card>

      <el-card class="container-card container-template">
        <div slot="header" class="clearfix">
          <span>通知模板</span>
        </div>
        <el-form-item label="模板名称">
          <template-type :type="task.template.type" size="small" />
          <template v-if="task.template.template_id">
            {{ task.template.template.name }}
          </template>
        </el-form-item>
        <template-detail
          :templates="templates"
          :activeCollapse="activeTemplateScene"
          style="margin-bottom: 20px; margin-top: 20px" />
      </el-card>

    </el-form>

    <!-- 停止任务 -->
    <el-dialog
      :title="`暂停任务【${focusTask.name}】`"
      :visible.sync="dialogPauseTaskVisible"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form class="form-container" label-width="120px" ref="form">
        <el-form-item label="暂停时间" prop="pauseInterval">
          <el-input-number v-model="pauseInterval" :min="1" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirmPause" :loading="formLoading">确认暂停</el-button>
          <el-button @click="dialogPauseTaskVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 发送告警消息 -->
    <el-dialog
      :title="`发送告警消息【${focusTask.name}】`"
      :visible.sync="dialogReportAlarmVisible"
      :close-on-click-modal="false"
      width="70%"
    >
      <el-form :model="formReportAlarm" class="form-container" label-width="120px" ref="form">
        <el-form-item label="告警级别" prop="level">
          <el-select v-model="formReportAlarm.level" clearable placeholder="请选择告警级别">
            <el-option
              v-for="(title, level) in levelsNoExtend"
              :key="level"
              :label="title"
              :value="Number(level)">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通知时间" prop="notice_time">
          <el-date-picker
            v-model="formReportAlarm.notice_time"
            type="datetime"
            value-format="timestamp"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="告警内容" prop="ctn">
          <json-editor
            v-model="formReportAlarm.ctn"
            style="line-height: 20px"
            placeholder="请输入告警内容，必须为JSON格式，且为JSON Object格式" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="reportAlarm" :loading="formLoading">发送告警</el-button>
          <el-button @click="dialogReportAlarmVisible = false">取消</el-button>

          <el-button type="success" style="margin-left: 50px" @click="fmtAlarmContent">JSON格式化</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 空URL用于打开wiki -->
    <a ref="api-url-docs" :href="apiUrlDocsUrl" target="_blank"></a>
  </div>
</template>

<script>
import { showTask, resetTaskToken, resetTaskSecret } from '@/api/alarmtask'
import HiddenToken from './components/HiddenToken'
import ReceiverShow from './components/ReceiverShow'
import ReceiverModuleShow from './components/ReceiverModuleShow'
import EnableStatusTag from './components/EnableStatusTag'
import TemplateDetail from '@/views/alarm-manage/template/components/TemplateDetail'
import TemplateType from '@/views/alarm-manage/template/components/TemplateType'
import LevelTag from '@/views/history/components/LevelTag'
import WorkflowStatus from '@/views/workflow/components/StatusTag'
import SelectMemberTag from '@/views/components/AddMembers/SelectMemberTag'
import {
  TASK_STATUS_STOPPED,
  TASK_STATUS_RUNNING,
  TASK_STATUS_PAUSE,
  levelsNoExtend,
  templateScenes,
  COMPRESS_METHOD_CONDITION,
  COMPRESS_METHOD_SIMHASH,
  COMPRESS_METHOD_CONTENT,
  COMPRESS_METHOD_FULL,
  compressMethods
} from '@/consts/alarm'
import MoreHandler from './mixins/more-handler'
import StatusTag from './components/StatusTag'
import ConditionShow from './components/ConditionShow'
import JsonEditor from '@/components/JsonEditor'
import Sticky from '@/components/Sticky'
import clipboard from '@/directive/clipboard/index.js'
import SelectAlarmTag from '@/views/components/AddAlarmTags/SelectAlarmTag'

export default {
  name: 'AlarmTaskShow',
  mixins: [ MoreHandler ],
  components: {
    HiddenToken,
    ReceiverShow,
    EnableStatusTag,
    TemplateDetail,
    LevelTag,
    WorkflowStatus,
    SelectMemberTag,
    StatusTag,
    ConditionShow,
    JsonEditor,
    Sticky,
    TemplateType,
    ReceiverModuleShow,
    SelectAlarmTag
  },
  directives: {
    clipboard
  },
  data () {
    return {
      taskId: null,
      task: {},
      templates: null,
      TASK_STATUS_STOPPED,
      TASK_STATUS_RUNNING,
      TASK_STATUS_PAUSE,
      levelsNoExtend,
      templateScenes,
      COMPRESS_METHOD_CONDITION,
      COMPRESS_METHOD_SIMHASH,
      COMPRESS_METHOD_CONTENT,
      COMPRESS_METHOD_FULL,
      compressMethods,
      activeTemplateScene: [Object.keys(templateScenes)[0]],
      apiAuth: {},
      apiUrlDocsUrlTpl: '{baseUri}alarm/{scene}.html',
      apiUrlDocsUrl: '', // 监控场景文档地址
      apis: {
        aliyun: '',
        arms: '',
        falcon: '',
        grafana: '',
        jsonbody: ''
      }
    }
  },
  computed: {
    manual () {
      return this.$store.state.settings.copyright.manual
    }
  },
  created () {
    this.taskId = Number(this.$route.params.taskId)
    this.showTask()
  },
  methods: {
    // 获取信息
    showTask () {
      showTask(this.taskId)
        .then(res => {
          this.task = res.data.task

          this.apiAuth = res.data.api_auth
          this.generateApi('aliyun')
          this.generateApi('grafana')
          this.generateApi('falcon')
          this.generateApi('arms')
          this.generateApi('jsonbody')

          this.templates = this.task.template.template_id ? this.task.template.template.template : this.task.template.udf
        })
    },
    // 生成告警API
    generateApi (scene) {
      this.apis[scene] = `${this.apiAuth.base_uri}/alarm/${scene}?` +
        ['taskid', 'timestamp', 'sign'].map(key => `${key}=` +
        encodeURIComponent(this.apiAuth[key])).join('&')
    },
    // 告警使用文档
    gotoApiUrlDocs (scene) {
      this.apiUrlDocsUrl = this.apiUrlDocsUrlTpl.replace('{baseUri}', this.manual).replace('{scene}', scene)
      this.$nextTick(() => {
        this.$refs['api-url-docs'].click()
      })
    },
    // 重置token
    resetToken () {
      const tips = '重置token会导致正在使用该任务的接口调用失效，确定仍然要重置token?'
      this.handleResetToken(tips, 'token', resetTaskToken)
    },
    // 重置secret
    resetSecret () {
      const tips = '重置secret会导致正在使用该任务的接口调用失效，确定仍然要重置secret?'
      this.handleResetToken(tips, 'secret', resetTaskSecret)
    },
    // 重置token handler
    handleResetToken (tips, field, call) {
      this.$confirm(tips, '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '取消',
        confirmButtonClass: 'el-button--info',
        cancelButtonText: '确认重置',
        cancelButtonClass: 'el-button--danger',
        type: 'warning'
      }).then(() => {
        this.$message.info('已取消')
      }).catch(action => {
        if (action !== 'cancel') {
          this.$message.info('已取消')
        } else {
          call(this.taskId)
            .then(res => {
              this.$set(this.task, field, res.data[field])
              this.$message.success('重置成功')
            })
        }
      })
    },
    // 删除成功时
    onDeleteSuccess (res, srcRow) {
      this.$router.push({ name: 'AlarmTask' })
    },
    // 复制成功
    copySuccess () {
      this.$message.success('复制成功')
    }
  }
}
</script>

<style lang="scss" scoped>
.container-card {
  margin-bottom: 20px;
}
.api-url {
  font-family: Consolas,"Courier New",Courier,FreeMono,monospace;
  display: inline-block;
  width: 39ch;
  font-size: 16px;
  margin-right: 28px;
}
</style>
