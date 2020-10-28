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

      <date-picker v-model="timerange" :shortcuts="setDatePickerShortcuts" :clearable="true" />
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
      <div class="filter-container-right clearfix">
        <el-button type="primary" size="mini" @click="handleExpandRows('json')">展开为JSON</el-button>
        <el-button type="primary" size="mini" @click="handleExpandRows('form')">展开为表单</el-button>
      </div>
    </div>

    <el-table
      style="width: 100%; margin-top: 20px; "
      :data="tableData"
      v-loading="tableLoading"
      border
      fit
      highlight-current-row
      row-key="id"
      :expand-row-keys="expandRowKeys"
    >
      <el-table-column type="expand">
        <template slot-scope="{ row }">
          <el-tabs v-model="activeExpand" type="card">
            <el-tab-pane label="JSON（告警内容）" name="json">
              <vue-json-pretty
                :show-double-quotes="true"
                :show-length="false"
                :show-line="true"
                :highlight-mouseover-node="true"
                :collapsed-on-click-brackets="true"
                :data="row.ctn_json" />
            </el-tab-pane>
            <el-tab-pane label="表单" name="form">
              <el-form label-position="left" class="compact-form">
                <el-form-item label="告警ID">
                  {{ row.id }}
                </el-form-item>
                <el-form-item label="UUID">
                  {{ row.uuid }}
                </el-form-item>
                <el-form-item label="所属部门">
                  {{ row.task && row.task.department ? row.task.department.name : `部门关联错误` }}
                </el-form-item>
                <el-form-item label="告警任务">
                  <router-link :to="{ name: 'AlarmTaskShow', params: { taskId: row.task_id }}" target="_blank">
                    <el-button type="text">
                      {{ row.task ? row.task.name : `任务ID${row.task_id}` }}
                    </el-button>
                  </router-link>
                </el-form-item>
                <el-form-item label="收敛指标">
                  {{ row.metric }}
                </el-form-item>
                <el-form-item label="收敛批次">
                  {{ row.batch }}
                </el-form-item>
                <el-form-item label="告警级别">
                  <level-tag :level="row.level" size="small" />
                </el-form-item>
                <el-form-item label="告警类型">
                  <type-tag :alarmType="row.type" size="small" />
                </el-form-item>
                <el-form-item label="告警内容">
                  <el-button type="success" size="mini" v-clipboard:copy="row.ctn" v-clipboard:success="copySuccess">复制</el-button>
                  {{ row.ctn }}
                </el-form-item>
                <el-form-item label="通知时间">
                  {{ row.notice_time | formatDate }}
                </el-form-item>
                <el-form-item label="入库时间">
                  {{ row.created_at | formatDate }}
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
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
            <template v-if="Object.keys(row.ctn_json).length > 0">
              <span v-for="(val, key) in row.ctn_json" :key="key">
                <code>{{ key }}:</code> {{ val }}
              </span>
            </template>
            <template v-else>
              {{ row.ctn }}
            </template>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="告警级别"
        width="80"
        align="center"
      >
        <template #default="{ row }">
          <level-tag :level="row.level" />
        </template>
      </el-table-column>
      <el-table-column
        label="通知时间"
        width="160"
        align="center"
      >
        <template #default="{ row }">
          {{ row.created_at | formatDate }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="80"
      >
        <template #default="{ row }">
          <router-link :to="{ name: 'AlarmHistoryShow', params: { historyId: row.id } }">
            <el-button type="success" size="mini">详情</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <div style="padding: 32px 16px; float: right;">
      <el-select v-model="pageSize" size="mini" style="width: 100px">
        <el-option
          v-for="allowPage in allowPageSizes"
          :key="allowPage"
          :label="`${allowPage}条/页`"
          :value="allowPage" />
      </el-select>
      <el-button size="mini" type="primary" :disabled="!hasPrevPage" @click="toPrevPage">上一页</el-button>
      <el-button size="mini" type="primary" :disabled="!hasNextPage" @click="toNextPage">下一页</el-button>
    </div>

  </div>
</template>

<script>
import { histories } from '@/api/alarmhistory'
import { formatDate, removeEmailSuffix } from '@/utils/filters'
import { formatInArrayNumber } from '@/utils/helpers'
import Pagination from '@/components/Pagination'
import DatePicker from '@/views/components/DatePicker'
import VueJsonPretty from 'vue-json-pretty'
import clipboard from '@/directive/clipboard/index.js'
import LevelTag from './components/LevelTag'
import TypeTag from './components/TypeTag'
import CascaderTask from '@/views/components/CascaderTask'
import { tagSearch } from '@/api/alarmtag'

export default {
  name: 'AlarmHistory',
  components: { Pagination, DatePicker, VueJsonPretty, LevelTag, TypeTag, CascaderTask },
  filters: { formatDate, removeEmailSuffix },
  directives: { clipboard },
  data () {
    return {
      tableLoading: false,
      tableData: [],
      page: 1,
      pageSize: 20,
      total: 0,
      timerange: [],
      search: null,
      activeExpand: 'json',
      isExpand: false,
      expandRowKeys: [],
      cascaderModel: [],
      allowPageSizes: [10, 20, 30, 50, 100],
      hasPrevPage: true,
      hasNextPage: true,
      sourceType: 1,
      tagId: null,
      tags: [],
      searchTagsLoading: false
    }
  },
  created () {
    if (this.$route.query.taskid) {
      this.cascaderModel = [null, this.$route.query.taskid]
    }
    this.getList()
    this.searchTags()
  },
  methods: {
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
    getList () {
      this.tableLoading = true
      histories(
        this.page,
        this.pageSize,
        this.cascaderModel[0],
        this.cascaderModel[1],
        this.search,
        this.timerange,
        { id: 'desc' },
        this.sourceType,
        this.actionPage,
        this.firstId,
        this.lastId,
        this.tagId
      ).then(res => {
        this.page = Number(res.data.current_page)
        this.pageSize = Number(res.data.per_page)
        this.total = Number(res.data.total)
        this.tableData = this.formatHistories(res.data.data)
        this.hasPrevPage = !(this.page == 1 || (this.actionPage == 'prev' && res.data.data.length == 0) || (this.actionPage == 'prev' && res.data.more == 0))
        this.hasNextPage = !((this.actionPage == 'next' && res.data.data.length == 0) || (this.actionPage == 'next' && res.data.more == 0))
        this.sourceType = Number(res.data.source_type)
      }).catch(error => {
        if (error.indexOf('<<告警记录已经没有数据了!>>') != -1) {
          if (this.search == null || this.search == '') {
            if (this.actionPage == 'prev') {
              this.hasPrevPage = false
            }
          } else {
            this.hasPrevPage = false
          }
        }
        this.hasNextPage = !(this.actionPage == 'next' && error.indexOf('<<告警记录已经没有数据了!>>') != -1)
      }).finally(() => {
        this.tableLoading = false
      })
    },
    // 格式化返回的告警记录数据
    formatHistories (historiesData) {
      historiesData.forEach(history => {
        history['id'] = Number(history['id'])
        history['level'] = Number(history['level'])
        history['created_at'] = Number(history['created_at'])
        try {
          history['ctn_json'] = JSON.parse(history['ctn'])
        } catch (e) {
          history['ctn_json'] = {}
        }
      })
      return historiesData
    },
    // 展开/折叠所有行
    handleExpandRows (tab) {
      if (this.expandRowKeys.length === 0 || this.activeExpand != tab) {
        this.activeExpand = tab
        this.expandRowKeys = this.tableData.map(row => row.id)
      } else {
        this.expandRowKeys = []
      }
    },
    // 执行搜索
    handleFilter () {
      this.page = 1
      this.actionPage = 'next'
      this.firstId = -1
      this.lastId = -1
      this.getList()
    },
    // 复制成功
    copySuccess () {
      this.$message.success('复制成功')
    },
    // 上一页
    toPrevPage () {
      if (this.tableData.length > 0) {
        this.firstId = this.tableData[0].id
      }
      // do request
      if (this.page > 1) {
        this.page--
      }
      this.actionPage = 'prev'
      this.getList()
    },
    // 下一页
    toNextPage () {
      if (this.tableData.length > 0) {
        this.lastId = this.tableData[this.tableData.length - 1].id
      }
      // do request
      this.page++
      this.actionPage = 'next'
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
