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
        <router-link :to="{ name: 'MonitorDatasourceCreate' }">
          <el-button type="primary" icon="el-icon-plus">创建数据源</el-button>
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
        label="类型"
        width="120"
      >
        <template #default="{ row }">
          <datasource-type :type="row.type" />
        </template>
      </el-table-column>
      <el-table-column
        label="数据源"
        width="320"
      >
        <template #default="{ row }">
          <datasource-name :row="row" />
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
        width="230"
      >
        <template #default="{ row }">
          <!-- <el-button type="success" size="mini" @click="showDatasource(row)">详情</el-button> -->
          <router-link :to="{ name: 'MonitorDatasourceEdit', params: { datasourceId: row.id }}">
            <el-button type="primary" size="mini">编辑</el-button>
          </router-link>
          <el-button type="danger" size="mini" @click="deleteDatasource(row)">删除</el-button>
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
    <!-- <el-dialog
      title="告警组详情"
      :visible.sync="dialogShowDatasource"
      width="60%"
    >
      <div class="filter-container clearfix">
        <div class="filter-container-right clearfix">
          <router-link :to="{ name: 'MonitorDatasourceEdit', params: { datasourceId: datasource.id }}">
            <el-button type="primary" size="small">编辑</el-button>
          </router-link>
          <el-button type="danger" size="small" @click="deleteDatasource(datasource)">删除</el-button>
        </div>
      </div>
      <datasource-detail :datasource="datasource" />
    </el-dialog> -->
  </div>
</template>

<script>
import { datasources, showDatasource, deleteDatasource } from '@/api/monitor/datasource'
import { formatDate } from '@/utils/filters'
import { formatInArrayNumber, formatInObjectNumber } from '@/utils/helpers'
import Pagination from '@/components/Pagination'
// import DatasourceDetail from './components/Detail'
import User from '@/views/components/User'
import DatasourceType from './component/DatasourceType'
import DatasourceName from './component/DatasourceName'

export default {
  name: 'MonitorDatasource',
  components: { Pagination, User, DatasourceType, DatasourceName },
  filters: { formatDate },
  data () {
    return {
      tableLoading: false,
      tableData: [],
      page: 1,
      pageSize: 20,
      total: 0,
      search: null,
      datasource: {},
      dialogShowDatasource: false,
      order: {}
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.tableLoading = true
      datasources(this.page, this.pageSize, this.search, this.order)
        .then(res => {
          this.page = Number(res.data.current_page)
          this.pageSize = Number(res.data.per_page)
          this.total = Number(res.data.total)
          this.tableData = formatInArrayNumber(res.data.data, ['id', 'type', 'created_at', 'created_by', 'updated_at'])
        }).finally(() => {
          this.tableLoading = false
        })
    },
    // 详情
    showDatasource (row) {
      this.tableLoading = true
      showDatasource(row.id)
        .then(res => {
          this.datasource = formatInObjectNumber(res.data.datasource, [
            'id', 'type', 'created_at', 'created_by', 'updated_at'
          ])
          this.dialogShowDatasource = true
        }).finally(() => {
          this.tableLoading = false
        })
    },
    // 删除
    deleteDatasource (row) {
      this.$confirm(`你确定要删除数据源【${row.name}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableLoading = true
        deleteDatasource(row.id)
          .then(res => {
            this.dialogShowDatasource = false
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
    }
  }
}
</script>
