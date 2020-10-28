import {
  claimPipeline,
  assignPipeline,
  processedPipeline,
  reactivePipeline,
  closePipeline
} from '@/api/workflow'
import {
  WORKFLOW_STATUS_PENDING,
  WORKFLOW_STATUS_PROCESSING,
  WORKFLOW_STATUS_PROCESSED,
  WORKFLOW_STATUS_CLOSED,
  WORKFLOW_STATUS_ASSIGN,
  WORKFLOW_STATUS_REACTIVE,
  CHANNELS
} from '@/consts/alarm'

export default {
  data () {
    return {
      WORKFLOW_STATUS_PENDING,
      WORKFLOW_STATUS_PROCESSING,
      WORKFLOW_STATUS_PROCESSED,
      WORKFLOW_STATUS_CLOSED,
      WORKFLOW_STATUS_ASSIGN,
      WORKFLOW_STATUS_REACTIVE,
      submitHandles: {
        [WORKFLOW_STATUS_PROCESSING]: 'submitClaim',
        [WORKFLOW_STATUS_PROCESSED]: 'submitProcessed',
        [WORKFLOW_STATUS_CLOSED]: 'submitClose',
        [WORKFLOW_STATUS_ASSIGN]: 'submitAssign',
        [WORKFLOW_STATUS_REACTIVE]: 'submitReactive'
      },
      processTitles: {
        '-1': '操作',
        [WORKFLOW_STATUS_PROCESSING]: '认领',
        [WORKFLOW_STATUS_PROCESSED]: '处理完成',
        [WORKFLOW_STATUS_CLOSED]: '关闭',
        [WORKFLOW_STATUS_ASSIGN]: '指派',
        [WORKFLOW_STATUS_REACTIVE]: '重新激活'
      },
      processStatus: -1,
      processRemark: null,
      processAssignTos: [],
      dialogProcessVisible: false,
      formLoading: false
    }
  },
  methods: {
    // 认领
    handleClaim () {
      if (this.selectedRows.length === 0) {
        return this.$message.error('请选择要认领的任务')
      }
      this.processRemark = null
      this.processStatus = WORKFLOW_STATUS_PROCESSING
      this.dialogProcessVisible = true
    },
    // 指派
    handleAssign () {
      if (this.selectedRows.length === 0) {
        return this.$message.error('请选择要认领的任务')
      }
      this.processRemark = null
      this.processStatus = WORKFLOW_STATUS_ASSIGN
      this.processAssignTos = []
      this.dialogProcessVisible = true
    },
    // 处理完成
    handleProcessed () {
      if (this.selectedRows.length === 0) {
        return this.$message.error('请选择要认领的任务')
      }
      this.processRemark = null
      this.processStatus = WORKFLOW_STATUS_PROCESSED
      this.dialogProcessVisible = true
    },
    // 重新激活
    handleReactive () {
      if (this.selectedRows.length === 0) {
        return this.$message.error('请选择要认领的任务')
      }
      this.processRemark = null
      this.processStatus = WORKFLOW_STATUS_REACTIVE
      this.dialogProcessVisible = true
    },
    // 关闭
    handleClose () {
      if (this.selectedRows.length === 0) {
        return this.$message.error('请选择要认领的任务')
      }
      this.processRemark = null
      this.processStatus = WORKFLOW_STATUS_CLOSED
      this.dialogProcessVisible = true
    },
    // 提交表单
    handleProcess () {
      this[this.submitHandles[this.processStatus]]()
    },
    // 提交认领表单
    submitClaim () {
      // 认领备注选填
      // 所有任务状态必须是待处理
      for (const workflow of this.selectedRows) {
        if (workflow.status != WORKFLOW_STATUS_PENDING) {
          return this.$message.warning('只有待处理的任务才能认领')
        }
      }
      this.formLoading = true
      claimPipeline(this.selectedRows.map(row => row.id), this.processRemark)
        .then(res => {
          this.handleSuccess(res.data.workflows)
          this.dialogProcessVisible = false
          this.showSubmitResult(res.data.errors, '认领')
        }).finally(() => {
          this.formLoading = false
        })
    },
    // 提交指派表单
    submitAssign () {
      // 指派备注必填
      if (!this.processRemark) {
        return this.$message.warning('指派必须填写备注')
      }
      // 所有任务状态必须是待处理或者处理中
      for (const workflow of this.selectedRows) {
        if ([WORKFLOW_STATUS_PENDING, WORKFLOW_STATUS_PROCESSING].indexOf(workflow.status) === -1) {
          return this.$message.warning('只有待处理或处理中的任务才能指派')
        }
      }
      // 指派人不能为空
      if (this.processAssignTos.length === 0) {
        return this.$message.warning('被指派人不能为空')
      }
      const assignTo = this.processAssignTos.map(row => row.uid)
      this.formLoading = true
      assignPipeline(this.selectedRows.map(row => row.id), this.processRemark, assignTo)
        .then(res => {
          this.handleSuccess(res.data.workflows)
          this.dialogProcessVisible = false
          this.showSubmitResult(res.data.errors, '指派')
        }).finally(() => {
          this.formLoading = false
        })
    },
    // 提交处理完成表单
    submitProcessed () {
      // 处理完成备注必填
      if (!this.processRemark) {
        return this.$message.warning('处理完成时必须填写备注')
      }
      // 所有任务状态必须是处理中
      for (const workflow of this.selectedRows) {
        if (workflow.status != WORKFLOW_STATUS_PROCESSING) {
          return this.$message.warning('只有处理中的任务才能处理完成')
        }
      }
      this.formLoading = true
      processedPipeline(this.selectedRows.map(row => row.id), this.processRemark)
        .then(res => {
          this.handleSuccess(res.data.workflows)
          this.dialogProcessVisible = false
          this.showSubmitResult(res.data.errors, '处理完成')
        }).finally(() => {
          this.formLoading = false
        })
    },
    // 提交重新激活表单
    submitReactive () {
      // 重新激活备注必填
      if (!this.processRemark) {
        return this.$message.warning('重新激活时必须填写备注')
      }
      // 所有任务状态必须是已关闭
      for (const workflow of this.selectedRows) {
        if (workflow.status != WORKFLOW_STATUS_CLOSED) {
          return this.$message.warning('只有已关闭的任务才能重新激活')
        }
      }
      this.formLoading = true
      reactivePipeline(this.selectedRows.map(row => row.id), this.processRemark)
        .then(res => {
          this.handleSuccess(res.data.workflows)
          this.dialogProcessVisible = false
          this.showSubmitResult(res.data.errors, '重新激活')
        }).finally(() => {
          this.formLoading = false
        })
    },
    // 提交关闭表单
    submitClose () {
      // 关闭备注必填
      if (!this.processRemark) {
        return this.$message.warning('关闭时必须填写备注')
      }
      // 所有任务状态必须是待处理或者处理中
      for (const workflow of this.selectedRows) {
        if ([WORKFLOW_STATUS_PENDING, WORKFLOW_STATUS_PROCESSING].indexOf(workflow.status) === -1) {
          return this.$message.warning('只有待处理或处理中的任务才能关闭')
        }
      }
      this.formLoading = true
      closePipeline(this.selectedRows.map(row => row.id), this.processRemark)
        .then(res => {
          this.handleSuccess(res.data.workflows)
          this.dialogProcessVisible = false
          this.showSubmitResult(res.data.errors, '关闭')
        }).finally(() => {
          this.formLoading = false
        })
    },
    // 展示工作流操作结果
    showSubmitResult (errors, action) {
      if (errors && Object.keys(errors).length > 0) {
        let msg = `<p>${action}成功，但以下工作流的部分通知渠道告警通知发送失败：</p><ul>`
        for (const workflowId in errors) {
          for (const channel in errors[workflowId]) {
            msg += `<li>
                  <strong>${workflowId}-${CHANNELS[channel] || channel}：</strong>
                  ${errors[workflowId][channel]}
                </li>`
          }
        }
        msg += '</ul>'
        msg += `<p>发送失败的通知并不影响工作的${action}</p>`

        this.$alert(msg, `${action}成功`, {
          confirmButtonText: '我已知晓',
          dangerouslyUseHTMLString: true
        })
      } else {
        this.$message.success(`${action}成功`)
      }
    }
  }
}
