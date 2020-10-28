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
        <router-link :to="{ name: 'AlarmGroupCreate' }">
          <el-button type="primary" icon="el-icon-plus">创建告警组</el-button>
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
        label="告警组名称"
        prop="name"
      />
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
        width="230"
      >
        <template #default="{ row }">
          <el-button type="success" size="mini" @click="showGroup(row)">详情</el-button>
          <router-link :to="{ name: 'AlarmGroupEdit', params: { groupId: row.id }}">
            <el-button type="primary" size="mini" @click="editGroup(row)">编辑</el-button>
          </router-link>
          <el-dropdown trigger="click" @command="handleMore(row, $event)">
            <el-button type="primary" size="mini">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="delete">
                <svg-icon icon-class="delete"></svg-icon> 删除
              </el-dropdown-item>
              <el-dropdown-item command="save-as">
                <svg-icon icon-class="save-as"></svg-icon> 另存为
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

    <!-- 告警组详细信息 -->
    <el-dialog
      title="告警组详情"
      :visible.sync="dialogShowGroup"
      width="60%"
    >
      <div class="filter-container clearfix">
        <div class="filter-container-right clearfix">
          <router-link :to="{ name: 'AlarmGroupEdit', params: { groupId: alarmGroup.id }}">
            <el-button type="primary" size="small">编辑</el-button>
          </router-link>
          <el-button type="danger" size="small" @click="deleteGroup(alarmGroup)">删除</el-button>
        </div>
      </div>
      <alarm-group-detail :alarm-group="alarmGroup" />
    </el-dialog>
  </div>
</template>

<script>
import { groups, showGroup, deleteGroup } from '@/api/alarmgroup'
import { formatDate } from '@/utils/filters'
import { formatInArrayNumber, formatInObjectNumber } from '@/utils/helpers'
import Pagination from '@/components/Pagination'
import AlarmGroupDetail from './components/Detail'
import User from '@/views/components/User'

export default {
  name: 'AlarmManageGroup',
  components: { Pagination, AlarmGroupDetail, User },
  filters: { formatDate },
  data () {
    return {
      tableLoading: false,
      tableData: [],
      page: 1,
      pageSize: 20,
      total: 0,
      search: null,
      alarmGroup: {},
      dialogShowGroup: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.tableLoading = true
      groups(this.page, this.pageSize, this.search)
        .then(res => {
          this.page = Number(res.data.current_page)
          this.pageSize = Number(res.data.per_page)
          this.total = Number(res.data.total)
          this.tableData = formatInArrayNumber(res.data.data, ['id', 'created_at'])
        }).finally(() => {
          this.tableLoading = false
        })
    },
    // 详情
    showGroup (row) {
      this.tableLoading = true
      showGroup(row.id)
        .then(res => {
          this.alarmGroup = formatInObjectNumber(res.data.alarmgroup, ['id'])
          this.dialogShowGroup = true
        }).finally(() => {
          this.tableLoading = false
        })
    },
    // 编辑
    editGroup (row) {
      this.editorData = row
      this.dialogEditorVisible = true
    },
    // 删除
    deleteGroup (row) {
      this.$confirm(`你确定要删除告警组【${row.name}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableLoading = true
        deleteGroup(row.id)
          .then(res => {
            this.dialogShowGroup = false
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
    // 另存为
    handleSaveAs (row) {
      this.$router.push({ name: 'AlarmGroupSaveAs', params: { groupId: row.id } })
    },
    // 更多按钮菜单项被点击
    handleMore (row, cmd) {
      switch (cmd) {
        case 'delete':
          return this.deleteGroup(row)
        case 'save-as':
          return this.handleSaveAs(row)
        default:
          this.$message.warning(`Not Support Command '${cmd}'`)
      }
    }
  }
}
</script>
