<template>
  <div class="app-container">
    <div class="filter-container clearfix">
      <el-input
        v-model="search"
        placeholder="请输入关键词回车搜索"
        style="width: 300px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter" />
      <div class="filter-container-right clearfix">
        <router-link :to="{ name: 'MonitorCycleCompareCreate' }">
          <el-button type="primary" icon="el-icon-plus">创建任务</el-button>
        </router-link>
      </div>
    </div>

    <el-table
      style="width: 100%; margin-top: 20px; "
      :data="tableData"
      v-loading="tableLoading"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        label="ID"
        prop="id"
        width="70"
        align="center"
      />
      <el-table-column
        label="部门名称"
        width="150"
      >
        <template #default="{ row }">
          {{ row.task && row.task.department ? row.task.department.name : '部门关联错误' }}
        </template>
      </el-table-column>
      <el-table-column
        label="告警任务"
        prop="task.name"
        width="150"
      />
      <el-table-column
        label="监控任务"
        prop="name"
        width="150"
      />
      <el-table-column
        label="任务状态"
        width="150"
      >
        <template #default="{ row }">
          <task-status :status="row.status" />
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        prop="remark"
      />
      <el-table-column
        label="创建时间"
        width="170"
        align="center"
      >
        <template #default="{ row }">
          {{ row.created_at | formatDate }}
        </template>
      </el-table-column>
      <el-table-column
        label="创建人"
        width="180"
        align="center"
      >
        <template #default="{ row }">
          <user :creator="row.creator" />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="160"
      >
        <template #default="{ row }">
          <router-link :to="{ name: 'MonitorCycleCompareEdit', params: { taskId: row.id }}">
            <el-button type="primary" size="mini">编辑</el-button>
          </router-link>
          <el-dropdown trigger="click" @command="handleMore(row, $event)">
            <el-button type="primary" size="mini">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="[TASK_STATUS_STOPPED, TASK_STATUS_STOPPING].indexOf(row.status) == -1" command="stop">
                <svg-icon icon-class="stop"></svg-icon> 停止
              </el-dropdown-item>
              <el-dropdown-item v-if="[TASK_STATUS_STOPPED, TASK_STATUS_STOPPING].indexOf(row.status) > -1" command="start">
                <svg-icon icon-class="start"></svg-icon> 启动
              </el-dropdown-item>
              <el-dropdown-item command="delete">
                <svg-icon icon-class="delete"></svg-icon> 删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="page"
      :limit.sync="pageSize"
      style="float: right"
      @pagination="getList" />
  </div>
</template>

<script>
import { tasks, deleteTask, startTask, stopTask } from '@/api/monitor/cyclecompare'
import { formatDate } from '@/utils/filters'
import { formatInArrayNumber } from '@/utils/helpers'
import Pagination from '@/components/Pagination'
import User from '@/views/components/User'
import MoreHandler from './mixins/more-handler'
import {
  TASK_STATUS_STARTING,
  TASK_STATUS_STARTED,
  TASK_STATUS_STOPPING,
  TASK_STATUS_STOPPED
} from '@/consts/monitor'
import TaskStatus from './component/TaskStatus'

export default {
  name: 'MonitorCycleCompare',
  components: { Pagination, User, TaskStatus },
  mixins: [ MoreHandler ],
  filters: { formatDate },
  data () {
    return {
      tableLoading: false,
      tableData: [],
      page: 1,
      pageSize: 20,
      total: 0,
      search: null,
      order: { },
      moreActions: {
        deleteTask,
        startTask,
        stopTask
      },
      TASK_STATUS_STARTING,
      TASK_STATUS_STARTED,
      TASK_STATUS_STOPPING,
      TASK_STATUS_STOPPED
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.tableLoading = true
      tasks(this.page, this.pageSize, this.search, this.order)
        .then(res => {
          this.page = Number(res.data.current_page)
          this.pageSize = Number(res.data.per_page)
          this.total = Number(res.data.total)
          this.tableData = formatInArrayNumber(res.data.data, ['id', 'created_at'])
        }).finally(() => {
          this.tableLoading = false
        })
    },
    // 删除
    deleteTask (row) {
      this.$confirm(`你确定要删除通用监控任务【${row.name}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableLoading = true
        deleteTask(row.id)
          .then(res => {
            // 移除数据
            this.tableData.forEach((content, index) => {
              if (content.id == res.data.id) {
                this.tableData.splice(index, 1)
              }
            })
            this.total -= 1
            this.$message.success('删除成功')
          }).finally(res => {
            this.tableLoading = false
          })
      })
    },
    // 执行搜索
    handleFilter () {
      this.page = 1
      this.getList()
    },
    // 更多按钮菜单项被点击
    handleMore (row, cmd) {
      switch (cmd) {
        case 'start':
          return this.handleStart(row)
        case 'stop':
          return this.handleStop(row)
        case 'delete':
          return this.handleDelete(row)
        default:
          this.$message.warning(`Not Support Command '${cmd}'`)
      }
    },
    // 删除成功时
    onDeleteSuccess (res, srcRow) {
      // 移除数据
      this.tableData.forEach((row, index) => {
        if (row.id == srcRow.id) {
          this.tableData.splice(index, 1)
        }
      })
      this.total -= 1
    }
  }
}
</script>
