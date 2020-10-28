<template>
  <div class="app-container">
    <el-tabs v-model="activeTab">
      <el-tab-pane name="basic">
        <span slot="label"><span style="color: #f56c6c">*</span> 基本信息</span>
        <create-basic
          v-model="postForm"
          ref="basic"
          @go-back="goBack"
          @change-active="changeActiveTab" />
      </el-tab-pane>
      <el-tab-pane name="receiver">
        <span slot="label"><span style="color: #f56c6c">*</span> 告警通知人</span>
        <create-receiver-module
          v-model="postForm.receiver"
          ref="receiver"
          :receiverTemplate="receiverTemplate"
          @go-back="goBack"
          @change-active="changeActiveTab"
          @submmit-form="submitForm" />
      </el-tab-pane>
      <el-tab-pane name="workflow">
        <span slot="label">告警工作流</span>
        <create-workflow
          v-model="postForm.workflow"
          ref="workflow"
          :receiverTemplate="receiverTemplate"
          @go-back="goBack"
          @change-active="changeActiveTab"
          @submmit-form="submitForm" />
      </el-tab-pane>
      <el-tab-pane name="filter">
        <span slot="label">告警过滤</span>
        <create-filter
          v-model="postForm.filter"
          ref="filter"
          @go-back="goBack"
          @change-active="changeActiveTab"
          @submmit-form="submitForm" />
      </el-tab-pane>
      <el-tab-pane name="compress">
        <span slot="label">告警收敛</span>
        <create-compress
          v-model="postForm.compress"
          ref="compress"
          @go-back="goBack"
          @change-active="changeActiveTab"
          @submmit-form="submitForm" />
      </el-tab-pane>
      <el-tab-pane name="upgrade">
        <span slot="label">告警升级</span>
        <create-upgrade
          v-model="postForm.upgrade"
          ref="upgrade"
          :receiverTemplate="receiverTemplate"
          @go-back="goBack"
          @change-active="changeActiveTab"
          @submmit-form="submitForm" />
      </el-tab-pane>
      <el-tab-pane name="recovery">
        <span slot="label">自动恢复</span>
        <create-recovery
          v-model="postForm.recovery"
          ref="recovery"
          @go-back="goBack"
          @change-active="changeActiveTab"
          @submmit-form="submitForm" />
      </el-tab-pane>
      <el-tab-pane name="template">
        <span slot="label">通知模板</span>
        <create-template
          v-model="postForm.template"
          ref="template"
          @update-templates="updateTemplates"
          @go-back="goBack"
          @change-active="changeActiveTab"
          @submmit-form="submitForm" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { formatNumber } from '@/utils/helpers'
import CreateBasic from './components/CreateBasic'
import CreateReceiverModule from './components/CreateReceiverModule'
import CreateWorkflow from './components/CreateWorkflow'
import CreateFilter from './components/CreateFilter'
import CreateCompress from './components/CreateCompress'
import CreateUpgrade from './components/CreateUpgrade'
import CreateRecovery from './components/CreateRecovery'
import CreateTemplate from './components/CreateTemplate'
import {
  CHANNELS,
  CHANNEL_WEBHOOK,
  RECV_DISPATCH_MODE_LAZY
} from '@/consts/alarm'
import { showTask, updateTask, storeTask } from '@/api/alarmtask'

const receiverChannels = {}
Object.keys(CHANNELS).forEach(channel => {
  if (channel === CHANNEL_WEBHOOK) {
    receiverChannels[channel] = {
      url: ''
    }
  } else {
    receiverChannels[channel] = []
  }
})

const templateChannels = {}
Object.keys(CHANNELS).forEach(channel => {
  templateChannels[channel] = null
})

const receiver = {
  alarmgroup: [],
  channels: receiverChannels,
  mode: RECV_DISPATCH_MODE_LAZY,
  dispatch: []
}

export default {
  name: 'AlarmTaskCreate',
  components: {
    CreateBasic,
    CreateReceiverModule,
    CreateWorkflow,
    CreateFilter,
    CreateCompress,
    CreateUpgrade,
    CreateRecovery,
    CreateTemplate
  },
  data () {
    return {
      activeTab: 'basic',
      postForm: {
        task_tags: [],
        id: null,
        name: null,
        department_id: null,
        flag_save_db: 1,
        permission: {
          rw: [],
          ro: []
        },
        receiver: JSON.parse(JSON.stringify(receiver)),
        workflow: {
          enable: false,
          reminds: []
        },
        filter: {
          enable: false,
          mode: 1,
          conditions: [],
          not_match: 1
        },
        compress: {
          enable: false,
          method: 1,
          conditions: [],
          strategy: 1,
          strategy_cycle: null,
          strategy_count: null,
          not_match: 1
        },
        upgrade: {
          enable: false,
          strategies: []
        },
        recovery: {
          enable: false,
          mode: 1,
          conditions: [],
          delay_interval: null
        },
        template: {
          template_id: null,
          udf: {}
        }
      },
      pageInited: false,
      formChange: false,
      formSubmitted: false,
      receiverTemplate: receiver
    }
  },
  watch: {
    postForm: {
      handler () {
        if (this.pageInited && !this.formChange) {
          this.registerUnload()
          this.formChange = true
        }
      },
      deep: true
    }
  },
  computed: {
    manual () {
      return this.$store.state.settings.copyright.manual
    }
  },
  created () {
    if (this.$route.params.taskId) {
      // 编辑或者另存为
      this.initForm(formatNumber(this.$route.params.taskId, 0), this.$route.name === 'AlarmTaskSaveAs')
    }

    // 实在无法准确获取页面是否初始化完成，采用延迟5s标记
    setTimeout(() => {
      this.pageInited = true
    }, 5000)
  },
  destroyed () {
    if (this.pageInited && this.formChange) {
      this.removeUnload()
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.pageInited && this.formChange && !this.formSubmitted) {
      this.$confirm(`您输入的内容尚未保存，确定离开此页面吗？`, '提示', {
        confirmButtonText: '确认离开',
        cancelButtonText: '我再想想',
        type: 'warning'
      }).then(() => {
        next()
      }).catch(() => {
        next(false)
      })
    } else {
      next()
    }
  },
  methods: {
    goBack () {
      this.$router.push({ name: 'AlarmTask' })
    },
    // 更改激活的tab
    changeActiveTab (targetTab) {
      this.activeTab = targetTab
    },
    // 注册unload事件
    registerUnload () {
      window.addEventListener('beforeunload', this.unloadEventHandle, false)
    },
    // 移除注册的unload事件
    removeUnload () {
      window.removeEventListener('beforeunload', this.unloadEventHandle, false)
    },
    // unload事件handler
    unloadEventHandle (event) {
      event = event || window.event
      event.returnValue = '您输入的内容尚未保存，确定离开此页面吗？'
    },
    // 更新模板
    updateTemplates (templates) {
      this.$set(this.postForm.template, 'udf', JSON.parse(JSON.stringify(templates)))
    },
    // 初始化表单
    initForm (taskId, isSaveAs = false) {
      showTask(taskId)
        .then(res => {
          const task = res.data.task
          this.$nextTick(() => {
            const createReceiverItem = this.$refs.receiver.$refs.createReceiverItem
            this.postForm = {
              ...this.$refs.basic.initForm(task),
              receiver: this.$refs.receiver.initForm(task),
              workflow: this.$refs.workflow.initForm(task, createReceiverItem),
              filter: this.$refs.filter.initForm(task),
              upgrade: this.$refs.upgrade.initForm(task, createReceiverItem),
              compress: this.$refs.compress.initForm(task),
              recovery: this.$refs.recovery.initForm(task),
              template: this.$refs.template.initForm(task)
            }

            // 如果不是saveAs，则为编辑，设置id
            if (!isSaveAs) {
              this.$set(this.postForm, 'id', formatNumber(task.id, 0))
            }
          })
        })
    },
    // 提交表单
    submitForm () {
      const form = this.getFormData()
      const loading = this.$loading({
        lock: true,
        text: '表单提交中，请稍后...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      if (form.id) {
        // 更新
        updateTask(form)
          .then(res => {
            this.taskStoreAndUpdateUtil(res, '更新')
          }).finally(() => {
            loading.close()
          })
      } else {
        storeTask(form)
          .then(res => {
            this.taskStoreAndUpdateUtil(res, '创建')
          }).finally(() => {
            loading.close()
          })
      }
    },
    // 后端返回没电话号的用户，前端提示
    taskStoreAndUpdateUtil (res, action) {
      if (!res.data.nullPhoneUsers || res.data.nullPhoneUsers.length == 0) {
        this.$message.success(action + '成功')
        this.formSubmitted = true
        this.$router.push({ name: 'AlarmTaskShow', params: { taskId: Number(res.data.task.id) } })
      } else {
        let msg = '<p class="text-danger">以下用户未配置手机号，会导致无法接收短信、电话告警通知，请点击右上角个人头像进入用户信息页完善手机号：</p><ul>'
        res.data.nullPhoneUsers.forEach(item => {
          msg += `<li>${item.username}（${item.user}）</li>`
        })
        msg += '</ul>'
        msg += `<p>详情请参考文档：<a href="${this.manual}faq/cannot-receiver-sms-phone.html" target="_blank" class="text-link">收不到短信和电话告警通知</a></p>`

        this.$alert(msg, '已保存', {
          confirmButtonText: '我已知晓',
          dangerouslyUseHTMLString: true,
          callback: () => {
            this.formSubmitted = true
            this.$router.push({ name: 'AlarmTaskShow', params: { taskId: Number(res.data.task.id) } })
          } })
      }
    },
    // 格式化表单数据
    getFormData () {
      const createReceiverItem = this.$refs.receiver.$refs.createReceiverItem

      const form = {
        ...this.$refs.basic.getFormData(),
        receiver: this.$refs.receiver.getFormData(),
        workflow: this.$refs.workflow.getFormData(createReceiverItem),
        filter: this.$refs.filter.getFormData(),
        upgrade: this.$refs.upgrade.getFormData(createReceiverItem),
        compress: this.$refs.compress.getFormData(),
        recovery: this.$refs.recovery.getFormData(),
        template: this.$refs.template.getFormData()
      }

      return form
    }
  }
}
</script>
