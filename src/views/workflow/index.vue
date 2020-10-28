<template>
  <div class="app-container">
    <div class="filter-container clearfix">
      <cascader-task
        v-model="cascaderModel"
        @setModel="val => cascaderModel = val"
        style="width: 300px" />
      <el-select
        v-model="tagId"
        filterable
        remote
        clearable
        reserve-keyword
        placeholder="请输入标签名进行筛选"
        :remote-method="searchTags"
        :loading="searchTagsLoading">
        <el-option
          v-for="tag in tags"
          :key="tag.id"
          :label="tag.name"
          :value="Number(tag.id)">
        </el-option>
      </el-select>

      <date-picker v-model="timerange" :shortcuts="setDatePickerShortcuts" clearable />
      <el-input
        v-model="search"
        placeholder="请输入搜索关键词"
        style="width: 300px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter" />
      <el-button type="primary" @click="handleFilter">筛选</el-button>
    </div>

    <div class="filter-container clearfix" style="margin-top: 20px">
      <el-radio-group v-model="filterStatus" size="small" @change="handleFilter">
        <el-radio-button
          v-for="(title, status) in filterStatuses"
          :key="status"
          :label="Number(status)">
          {{ title }} ({{ statisticsByStatus[status] }})
        </el-radio-button>
        <el-radio-button :label="null">全部 ({{ totalStatistics }})</el-radio-button>
      </el-radio-group>
      <div class="filter-container-right clearfix">
        <el-button
          v-if="[WORKFLOW_STATUS_PENDING, null].indexOf(filterStatus) > -1"
          type="primary"
          size="small"
          @click="handleClaim">认领</el-button>
        <el-button
          v-if="[WORKFLOW_STATUS_PROCESSING, null].indexOf(filterStatus) > -1"
          type="success"
          size="small"
          @click="handleProcessed">处理完成</el-button>
        <el-button
          v-if="[WORKFLOW_STATUS_CLOSED, null].indexOf(filterStatus) > -1"
          type="danger"
          size="small"
          @click="handleReactive">重新激活</el-button>
        <el-button
          v-if="[WORKFLOW_STATUS_PENDING, WORKFLOW_STATUS_PROCESSING, null].indexOf(filterStatus) > -1"
          type="warning"
          size="small"
          @click="handleAssign">指派</el-button>
        <el-button
          v-if="[WORKFLOW_STATUS_PENDING, WORKFLOW_STATUS_PROCESSING, null].indexOf(filterStatus) > -1"
          type="info"
          size="small"
          @click="handleClose">关闭</el-button>
      </div>
    </div>

    <el-table
      style="width: 100%; margin-top: 20px; "
      :data="tableData"
      v-loading="tableLoading"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="55" />
      <el-table-column
        label="ID"
        width="90"
        align="center"
        prop="id" />
      <el-table-column
        label="部门"
        width="180"
        prop="department.name"
      >
        <template #default="{ row }">
          {{ row.task && row.task.department ? row.task.department.name : '部门关联错误' }}
        </template>
      </el-table-column>
      <el-table-column
        label="告警任务"
        width="180"
        prop="task.name"
      >
        <template #default="{ row }">
          {{ row.task ? row.task.name : '告警任务关联错误' }}
        </template>
      </el-table-column>
      <el-table-column
        label="告警信息"
        align="left"
      >
        <template #default="{ row }">
          <div class="ctn-ellipsis">
            <template v-if="Object.keys(row.history.ctn_json).length > 0">
              <span v-for="(val, key) in row.history.ctn_json" :key="key">
                <code>{{ key }}:</code> {{ val }}
              </span>
            </template>
            <template v-else>
              {{ row.history.ctn }}
            </template>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="80"
        align="center"
      >
        <template #default="{ row }">
          <status-tag :status="row.status" />
        </template>
      </el-table-column>
      <el-table-column
        label="最后更新时间"
        width="160"
        align="center"
      >
        <template #default="{ row }">
          {{ row.updated_at | formatDate }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="80"
      >
        <template #default="{ row }">
          <router-link :to="{ name: 'AlarmWorkflowShow', params: { workflowId: row.id } }">
            <el-button type="success" size="mini">详情</el-button>
          </router-link>
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
import {
  workflows,
  statisticsByStatus
} from '@/api/workflow'
import { formatDate, removeEmailSuffix } from '@/utils/filters'
import { formatInArrayNumber, formatInObjectNumber } from '@/utils/helpers'
import Pagination from '@/components/Pagination'
import DatePicker from '@/views/components/DatePicker'
import StatusTag from './components/StatusTag'
import VueJsonPretty from 'vue-json-pretty'
import {
  allowWorkflowStatuses,
  WORKFLOW_STATUS_PENDING,
  WORKFLOW_STATUS_PROCESSING,
  WORKFLOW_STATUS_PROCESSED,
  WORKFLOW_STATUS_CLOSED,
  WORKFLOW_STATUS_ASSIGN
} from '@/consts/alarm'
import AddMembersSelect from '@/views/components/AddMembers/Select'
import ProcessHandleMixin from './mixins/process-handle'
import CascaderTask from '@/views/components/CascaderTask'
import { tagSearch } from '@/api/alarmtag'

export default {
  name: 'AlarmHistory',
  mixins: [ProcessHandleMixin],
  components: { Pagination, DatePicker, StatusTag, VueJsonPretty, AddMembersSelect, CascaderTask },
  filters: { formatDate, removeEmailSuffix },
  data () {
    return {
      tableLoading: false,
      tableData: [],
      page: 1,
      pageSize: 20,
      total: 0,
      timerange: [],
      search: null,
      filterStatus: WORKFLOW_STATUS_PENDING,
      filterStatuses: {},
      statisticsByStatus: {},
      selectedRows: [],
      cascaderModel: [],
      tagId: null,
      tags: [],
      searchTagsLoading: false,
      WORKFLOW_STATUS_PENDING,
      WORKFLOW_STATUS_PROCESSING,
      WORKFLOW_STATUS_PROCESSED,
      WORKFLOW_STATUS_CLOSED,
      WORKFLOW_STATUS_ASSIGN
    }
  },
  computed: {
    totalStatistics () {
      let sum = 0
      for (const key in this.filterStatuses) {
        sum += this.statisticsByStatus[Number(key)]
      }
      return sum
    }
  },
  created () {
    if (this.$route.query.taskid) {
      this.cascaderModel = [null, this.$route.query.taskid]
    }
    this.initFilterStatuses()
    this.getStatisticsByStatus()
    this.getList()
    this.searchTags()
  },
  methods: {
    // 状态分类统计
    getStatisticsByStatus () {
      this.tableLoading = true
      statisticsByStatus(
        this.cascaderModel[0],
        this.cascaderModel[1],
        this.timerange,
        this.tagId
      )
        .then(res => {
          this.statisticsByStatus = res.data.statistics
        }).finally(() => {
          this.tableLoading = false
        })
    },
    // 初始化用于筛选的状态
    initFilterStatuses () {
      this.filterStatuses = allowWorkflowStatuses([
        WORKFLOW_STATUS_PENDING,
        WORKFLOW_STATUS_PROCESSING,
        WORKFLOW_STATUS_PROCESSED,
        WORKFLOW_STATUS_CLOSED
      ])
    },
    // 设置日历筛选组件快捷方式
    setDatePickerShortcuts (picker) {
      const todayTs = new Date(new Date().toLocaleDateString()).getTime()
      const shortcuts = [
        picker.shortcutLast('最近10分钟', 10 * 60),
        picker.shortcutLast('最近20分钟', 20 * 60),
        picker.shortcutLast('最近30分钟', 30 * 60),
        picker.shortcutLast('最近1小时', 60 * 60),
        picker.shortcutLast('最近2小时', 2 * 60 * 60),
        picker.shortcutLast('最近3小时', 3 * 60 * 60),
        picker.shortcutLast('最近5小时', 3 * 60 * 60),
        picker.shortcutLast('最近10小时', 10 * 60 * 60),
        picker.shortcut('今天', todayTs, new Date()),
        picker.shortcut('昨天', todayTs - 86400 * 1000, todayTs - 1),
        picker.shortcut('前天', todayTs - 2 * 86400 * 1000, todayTs - 86400 * 1000 - 1)
      ]
      return shortcuts
    },
    // 表格选中事件
    handleSelectChange (rows) {
      this.selectedRows = rows
    },
    getList () {
      this.tableLoading = true
      workflows(
        this.page,
        this.pageSize,
        this.filterStatus,
        this.cascaderModel[0],
        this.cascaderModel[1],
        this.search,
        this.timerange,
        {},
        this.tagId
      ).then(res => {
        this.page = Number(res.data.current_page)
        this.pageSize = Number(res.data.per_page)
        this.total = Number(res.data.total)
        this.tableData = this.formatWorkflows(res.data.data)
      }).finally(() => {
        this.tableLoading = false
      })
    },
    // 格式化返回的工作流数据
    formatWorkflows (workflowsParam) {
      const formattedWorkflows = []
      workflowsParam.forEach(workflow => {
        if (!workflow.history) {
          // history为空，不渲染
          return
        }

        workflow = formatInObjectNumber(workflow, ['id', 'task_id', 'history_id', 'status', 'created_at', 'updated_at'])
        workflow['history'] = formatInObjectNumber(workflow['history'], ['id', 'level', 'updated_at'])
        try {
          workflow['history']['ctn_json'] = JSON.parse(workflow['history']['ctn'])
        } catch (e) {
          workflow['history']['ctn_json'] = {}
        }
        formattedWorkflows.push(workflow)
      })
      return formattedWorkflows
    },
    // 执行搜索
    handleFilter () {
      this.page = 1
      this.getList()
      this.getStatisticsByStatus()
    },
    // 成功时的操作
    handleSuccess (workflowsData) {
      workflowsData.forEach(workflow => {
        for (const index in this.tableData) {
          if (workflow.id == this.tableData[index].id) {
            const oldStatus = this.tableData[index].status
            this.$set(this.statisticsByStatus, oldStatus, this.statisticsByStatus[oldStatus] - 1)
            this.$set(this.statisticsByStatus, workflow.status, this.statisticsByStatus[workflow.status] + 1)
            if (this.filterStatus === null) {
              this.$set(this.tableData[index], 'status', workflow.status)
            } else {
              this.tableData.splice(index, 1)
            }
          }
        }
      })
    },
    // 远程搜索告警tag
    searchTags (query) {
      this.searchTagsLoading = true
      tagSearch(query)
        .then(res => {
          this.tags = formatInArrayNumber(res.data.task_tags, ['id'])
        }).finally(() => {
          this.searchTagsLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.ctn-ellipsis {
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
</style>
