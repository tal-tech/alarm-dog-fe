import {
  deleteTask,
  stopTask,
  startTask,
  pauseTask,
  reportAlarm,
  getRateLimit,
  updateRateLimit
} from '@/api/alarmtask'
import {
  TASK_STATUS_STOPPED,
  TASK_STATUS_RUNNING,
  TASK_STATUS_PAUSE
} from '@/consts/alarm'

export default {
  data () {
    return {
      focusTask: {},
      dialogPauseTaskVisible: false,
      pauseInterval: 10,
      formLoading: false,
      dialogReportAlarmVisible: false,
      dialogRateLimitVisible: false,
      formReportAlarm: {},
      formRateLimit: null
    }
  },
  methods: {
    // 任务启动
    handleStart (row) {
      this.$confirm(`你确定要启动告警任务【${row.name}】吗？`, '提示', {
        confirmButtonText: '确定启动',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableLoading = true
        startTask(row.id)
          .then(res => {
            row.status = TASK_STATUS_RUNNING

            this.onStartSuccess && this.onStartSuccess(res, row)

            this.$message.success('启动成功')
          }).finally(res => {
            this.tableLoading = false
          })
      })
    },
    // 任务暂停
    handlePause (row) {
      this.focusTask = row
      this.pauseInterval = 10
      this.dialogPauseTaskVisible = true
    },
    // 确认暂停任务
    confirmPause () {
      if (this.pauseInterval < 1) {
        return this.$message.error('暂停时间至少为1分钟')
      }

      this.formLoading = true
      pauseTask(this.focusTask.id, this.pauseInterval)
        .then(res => {
          this.focusTask.status = TASK_STATUS_PAUSE

          this.onPauseSuccess && this.onPauseSuccess(res, this.focusTask)

          this.dialogPauseTaskVisible = false

          this.$message.success('暂停成功')
        }).finally(res => {
          this.formLoading = false
        })
    },
    // 任务停止
    handleStop (row) {
      this.$confirm(`你确定要停止告警任务【${row.name}】吗？`, '提示', {
        confirmButtonText: '确定停止',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableLoading = true
        stopTask(row.id)
          .then(res => {
            row.status = TASK_STATUS_STOPPED

            this.onStopSuccess && this.onStopSuccess(res, row)

            this.$message.success('停止成功')
          }).finally(res => {
            this.tableLoading = false
          })
      })
    },
    // 任务删除
    handleDelete (row) {
      this.$confirm(`你确定要删除告警任务【${row.name}】吗？`, '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableLoading = true
        deleteTask(row.id)
          .then(res => {
            this.onDeleteSuccess && this.onDeleteSuccess(res, row)

            this.$message.success('删除成功')
          }).finally(res => {
            this.tableLoading = false
          })
      })
    },
    // 触发发送告警按钮
    handleReportAlarm (row) {
      this.focusTask = row
      this.formReportAlarm = {}
      this.dialogReportAlarmVisible = true
    },
    // 格式化告警内容
    fmtAlarmContent () {
      try {
        const ctn = JSON.stringify(JSON.parse(this.formReportAlarm.ctn), null, 2)
        this.$set(this.formReportAlarm, 'ctn', ctn)
      } catch (e) {
        this.$message.error('格式化JSON失败：' + e)
      }
    },
    // 发送告警
    reportAlarm () {
      // 告警内容字段校验
      if (!this.formReportAlarm.ctn) {
        return this.$message.error('告警内容必填')
      }

      let ctn
      try {
        ctn = JSON.parse(this.formReportAlarm.ctn)
      } catch (e) {
        return this.$message.error('告警内容必须为JSON格式：' + e)
      }
      if (ctn.constructor !== Object) {
        return this.$message.error('告警内容必须为JSON Object格式')
      }
      if (Object.keys(ctn).length === 0) {
        return this.$message.error('告警内容不能为空JSON Object')
      }

      const level = typeof this.formReportAlarm.level === 'undefined' ? null : Number(this.formReportAlarm.level)
      const noticeTime = typeof this.formReportAlarm.notice_time === 'undefined' ? null : Number(this.formReportAlarm.notice_time / 1000)

      this.formLoading = true
      reportAlarm(this.focusTask.id, ctn, level, noticeTime)
        .then(res => {
          this.onReportAlarmSuccess && this.onReportAlarmSuccess(res, this.focusTask)

          this.dialogReportAlarmVisible = false

          this.$message.success('发送告警成功')
        }).finally(res => {
          this.formLoading = false
        })
    },
    // 另存为
    handleSaveAs (row) {
      this.$router.push({ name: 'AlarmTaskSaveAs', params: { taskId: row.id } })
    },
    // 查询阈值
    handleRateLimit (row) {
      this.focusTask = row
      getRateLimit(row.id)
        .then(res => {
          this.formRateLimit = res.data.rate_limit
        }).finally(
          this.dialogRateLimitVisible = true
        )
    },
    // 修改阈值
    updateRateLimit (rateLimit) {
      this.formLoading = true
      updateRateLimit(this.focusTask.id, rateLimit)
        .then(res => {
          if (!res.code) {
            this.dialogRateLimitVisible = false
            this.$message.success('修改阈值成功')
          }
        }).finally(
          this.formLoading = false
        )
    }
  }
}
