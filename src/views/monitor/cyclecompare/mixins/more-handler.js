import {
  TASK_STATUS_STARTING,
  TASK_STATUS_STOPPING
} from '@/consts/monitor'

export default {
  methods: {
    // 任务启动
    handleStart (row) {
      this.$confirm(`你确定要启动监控任务【${row.name}】吗？`, '提示', {
        confirmButtonText: '确定启动',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableLoading = true
        this.moreActions.startTask(row.id)
          .then(res => {
            row.status = TASK_STATUS_STARTING

            this.onStartSuccess && this.onStartSuccess(res, row)

            this.$message.success('任务正在启动中')
          }).finally(res => {
            this.tableLoading = false
          })
      })
    },
    // 任务停止
    handleStop (row) {
      this.$confirm(`你确定要停止监控任务【${row.name}】吗？`, '提示', {
        confirmButtonText: '确定停止',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableLoading = true
        this.moreActions.stopTask(row.id)
          .then(res => {
            row.status = TASK_STATUS_STOPPING

            this.onStopSuccess && this.onStopSuccess(res, row)

            this.$message.success('任务正在停止中')
          }).finally(res => {
            this.tableLoading = false
          })
      })
    },
    // 任务删除
    handleDelete (row) {
      this.$confirm(`你确定要删除监控任务【${row.name}】吗？`, '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableLoading = true
        this.moreActions.deleteTask(row.id)
          .then(res => {
            this.onDeleteSuccess && this.onDeleteSuccess(res, row)

            this.$message.success('删除成功')
          }).finally(res => {
            this.tableLoading = false
          })
      })
    }
  }
}
