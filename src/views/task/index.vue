<template>
  <div class="app-container">
    <div class="filter-container clearfix">
      <el-select v-model="depId" filterable clearable placeholder="请选择部门进行筛选">
        <el-option
          v-for="department in departments"
          :key="department.id"
          :label="department.name"
          :value="department.id">
        </el-option>
      </el-select>
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

      <el-input
        v-model="search"
        placeholder="请输入任务名称"
        style="width: 300px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter" />
      <el-button type="primary" @click="handleFilter">筛选</el-button>
      <div class="filter-container-right clearfix">
        <router-link :to="{ name: 'AlarmTaskCreate' }" id="btn-task-create">
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
        label="任务ID"
        prop="id"
        width="70"
        align="center"
      />
      <el-table-column
        label="告警任务名称"
        prop="name"
      />
      <el-table-column
        label="标签"
        prop="task_tags"
      >
        <template #default="{ row }">
          <select-alarm-tag
            v-for="(tag, index) in row.task_tags"
            :key="index"
            :tag="tag"
            :closable="false"
            size="small"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="部门"
        width="180"
        prop="department.name"
      >
        <template #default="{ row }">
          {{ row.department ? row.department.name : '部门关联错误' }}
        </template>
      </el-table-column>
      <el-table-column
        label="负责人"
        width="180"
        align="center"
      >
        <template #default="{ row }">
          <user :creator="row.creator" />
        </template>
      </el-table-column>
      <el-table-column
        label="运行状态"
        width="120"
        align="center"
      >
        <template #default="{ row }">
          <status-tag :status="row.status" size="medium"></status-tag>
        </template>
      </el-table-column>
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
        label="操作"
        width="230"
      >
        <template #default="{ row }">
          <router-link :to="{ name: 'AlarmTaskShow', params: { taskId: row.id }}">
            <el-button type="success" size="mini">详情</el-button>
          </router-link>
          <router-link :to="{ name: 'AlarmTaskEdit', params: { taskId: row.id }}">
            <el-button type="primary" size="mini">编辑</el-button>
          </router-link>
          <el-dropdown trigger="click" @command="handleMore(row, $event)">
            <el-button type="primary" size="mini">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="row.status !== TASK_STATUS_STOPPED" command="stop">
                <svg-icon icon-class="stop"></svg-icon> 停止
              </el-dropdown-item>
              <el-dropdown-item v-if="row.status !== TASK_STATUS_RUNNING" command="start">
                <svg-icon icon-class="start"></svg-icon> 启动
              </el-dropdown-item>
              <el-dropdown-item v-if="row.status !== TASK_STATUS_PAUSE" command="pause">
                <svg-icon icon-class="pause"></svg-icon> 暂停
              </el-dropdown-item>
              <el-dropdown-item command="delete">
                <svg-icon icon-class="delete"></svg-icon> 删除
              </el-dropdown-item>
              <el-dropdown-item command="save-as">
                <svg-icon icon-class="save-as"></svg-icon> 另存为
              </el-dropdown-item>
              <el-dropdown-item command="report-alarm">
                <svg-icon icon-class="send"></svg-icon> 发送告警
              </el-dropdown-item>
              <el-dropdown-item command="history">
                <svg-icon icon-class="history"></svg-icon> 告警记录
              </el-dropdown-item>
              <el-dropdown-item command="workflow">
                <svg-icon icon-class="workflow"></svg-icon> 工作流处理
              </el-dropdown-item>
              <el-dropdown-item command="rate-limit">
                <svg-icon icon-class="rate-limit"></svg-icon> 修改阈值
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

    <!-- 修改阈值 -->
    <el-dialog
      :title="`修改阈值`"
      :visible.sync="dialogRateLimitVisible"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form class="form-container" label-width="250px" ref="form">
        <el-form-item label="当前阈值" prop="pauseInterval">
          <el-input-number v-model="formRateLimit" :min="1" placeholder="请输入阈值" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateRateLimit(formRateLimit)" :loading="formLoading">确 认</el-button>
          <el-button @click="dialogRateLimitVisible = false">取 消</el-button>
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
  </div>
</template>

<script>
import { tagSearch } from '@/api/alarmtag'
import { simpleDepartments } from '@/api/department'
import { tasks } from '@/api/alarmtask'
import { formatDate } from '@/utils/filters'
import { formatInArrayNumber } from '@/utils/helpers'
import Pagination from '@/components/Pagination'
import StatusTag from './components/StatusTag'
import {
  TASK_STATUS_STOPPED,
  TASK_STATUS_RUNNING,
  TASK_STATUS_PAUSE,
  levelsNoExtend
} from '@/consts/alarm'
import MoreHandler from './mixins/more-handler'
import JsonEditor from '@/components/JsonEditor'
import User from '@/views/components/User'
import SelectAlarmTag from '@/views/components/AddAlarmTags/SelectAlarmTag'
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps from './steps'

export default {
  name: 'AlarmTask',
  components: { Pagination, StatusTag, JsonEditor, User, SelectAlarmTag },
  filters: { formatDate },
  mixins: [ MoreHandler ],
  data () {
    return {
      tableLoading: false,
      tableData: [],
      page: 1,
      pageSize: 20,
      total: 0,
      depId: null,
      search: null,
      departments: [],
      TASK_STATUS_STOPPED,
      TASK_STATUS_RUNNING,
      TASK_STATUS_PAUSE,
      levelsNoExtend,
      tagId: null,
      tags: [],
      searchTagsLoading: false,
      driver: null
    }
  },
  computed: {
    buId () {
      return this.$store.state.app.buId
    }
  },
  watch: {
    buId () {
      this.getDepartments()
      this.getList()
    }
  },
  created () {
    // 获取tagId参数
    if (this.$route.query.tagId && !isNaN(parseInt(this.$route.query.tagId))) {
      this.tagId = parseInt(this.$route.query.tagId)
    }

    this.getDepartments()
    this.getList()
    // 初始化一次，直接触发也有数据
    this.searchTags(this.tagId)
  },
  mounted () {
    this.initGuide()
  },
  methods: {
    // 用于筛选的部门列表
    getDepartments () {
      simpleDepartments(null, null, this.buId)
        .then(res => {
          this.departments = formatInArrayNumber(res.data.departments, ['id'])
        })
    },
    getList () {
      this.tableLoading = true
      tasks(this.page, this.pageSize, this.depId, this.search, this.tagId)
        .then(res => {
          this.page = Number(res.data.current_page)
          this.pageSize = Number(res.data.per_page)
          this.total = Number(res.data.total)
          this.tableData = formatInArrayNumber(res.data.data, ['id', 'status', 'created_at'])
        }).finally(() => {
          this.tableLoading = false
        })
    },
    // 更多按钮菜单项被点击
    handleMore (row, cmd) {
      switch (cmd) {
        case 'start':
          return this.handleStart(row)
        case 'stop':
          return this.handleStop(row)
        case 'pause':
          return this.handlePause(row)
        case 'delete':
          return this.handleDelete(row)
        case 'save-as':
          return this.handleSaveAs(row)
        case 'report-alarm':
          return this.handleReportAlarm(row)
        case 'history':
          return this.$router.push({ name: 'AlarmHistory', query: { taskid: row.id } })
        case 'workflow':
          return this.$router.push({ name: 'AlarmWorkflow', query: { taskid: row.id } })
        case 'rate-limit':
          return this.handleRateLimit(row)
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
    },
    // 执行搜索
    handleFilter () {
      this.page = 1
      this.getList()
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
    },
    // 初始化引导
    initGuide () {
      this.driver = new Driver({
        doneBtnText: '结束',
        closeBtnText: '关闭',
        nextBtnText: '下一步',
        prevBtnText: '上一步',
        keyboardControl: true,
        stageBackground: 'transparent',
        onReset: (el) => {
          localStorage.setItem('dog-guided', 1)
        }
      })
      // 简易实现记录
      if (!localStorage.getItem('dog-guided')) {
        this.$nextTick(() => {
          this.guide()
        })
      }
    },
    // 开始启动引导
    guide () {
      this.driver.defineSteps(steps)
      this.driver.start()
    }
  }
}
</script>
