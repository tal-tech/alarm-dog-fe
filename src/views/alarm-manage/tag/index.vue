<template>
  <div class="app-container">
    <div class="filter-container clearfix">
      <el-input
        v-model="search"
        placeholder="请输入关键词回车搜索"
        style="width: 300px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <div class="filter-container-right clearfix">
        <el-button type="primary" icon="el-icon-plus" @click="tagCreate()">创建标签</el-button>
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
      <el-table-column label="ID" prop="id" width="70" align="center" />
      <el-table-column label="标签名称" prop="name" />
      <el-table-column label="备注" prop="remark" />
      <el-table-column label="创建时间" width="170" align="center">
        <template #default="{ row }">
          {{ row.created_at | formatDate }}
        </template>
      </el-table-column>
      <el-table-column label="创建人" width="180" align="center">
        <template #default="{ row }">
          <user :creator="row.creator" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="270">
        <template #default="{ row }">
          <router-link :to="{ name: 'AlarmTask', query: { tagId: row.id }}" target="_blank" style="margin-right: 10px">
            <el-button type="success" size="mini">关联的任务</el-button>
          </router-link>
          <el-button type="warning" size="mini" @click="tagEdit(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="tagDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 创建/编辑标签 -->
    <el-dialog :title="tagModel.id ? '编辑标签' : '创建标签'" :visible.sync="dialogModelVisible">
      <el-form :model="tagModel" class="form-container" label-width="120px" ref="form">
        <el-form-item label="标签名" :width="500">
          <el-input v-model="tagModel.name" placeholder="请输入标签名" />
        </el-form-item>
        <el-form-item label="备注" :width="500">
          <el-input type="textarea" v-model="tagModel.remark" placeholder="请输入备注（选填）" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogModelVisible = false">取 消</el-button>
        <el-button v-if="tagModel.id" :loading="tagModelLoading" type="primary" @click="tagUpdate()">确 定</el-button>
        <el-button v-else type="primary" :loading="tagModelLoading" @click="tagStore()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分页组件 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="page"
      :limit.sync="pageSize"
      style="float: right"
      @pagination="tagList"
    />
  </div>
</template>

<script>
import { tagList, tagUpdate, tagStore, tagDelete } from '@/api/alarmtag'
import { formatDate } from '@/utils/filters'
import { formatInArrayNumber, formatInObjectNumber } from '@/utils/helpers'
import Pagination from '@/components/Pagination'
import User from '@/views/components/User'

export default {
  name: 'AlarmTag',
  components: { Pagination, User },
  filters: { formatDate },
  data () {
    return {
      tableLoading: false,
      tableData: [],
      page: 1,
      pageSize: 20,
      total: 0,
      search: null,
      dialogModelVisible: false,
      tagModel: {},
      tagModelLoading: false
    }
  },
  created () {
    this.tagList()
  },
  methods: {
    tagList () {
      this.tableLoading = true
      tagList(this.page, this.pageSize, this.search)
        .then(res => {
          this.page = Number(res.data.current_page)
          this.pageSize = Number(res.data.per_page)
          this.total = Number(res.data.total)
          this.tableData = formatInArrayNumber(res.data.data, [
            'id',
            'created_at'
          ])
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    tagCreate () {
      this.tagModel = {}
      this.dialogModelVisible = true
    },
    tagStore () {
      this.tagModelLoading = true
      tagStore(this.tagModel)
        .then(res => {
          this.tableData.unshift(formatInObjectNumber(res.data.tag, ['id']))
          this.total += 1
          this.dialogModelVisible = false
          this.$message.success('创建成功')
        })
        .finally(() => {
          this.tagModelLoading = false
        })
    },
    tagEdit (row) {
      this.tagModel = {
        id: row.id,
        name: row.name,
        remark: row.remark
      }
      this.dialogModelVisible = true
    },
    tagUpdate () {
      this.tagModelLoading = true
      tagUpdate(this.tagModel.id, this.tagModel)
        .then(res => {
          this.dialogModelVisible = false
          this.$message.success('更新成功')
          this.tagList()
        })
        .finally(() => {
          this.tagModelLoading = true
        })
    },
    // 删除
    tagDelete (row) {
      this.$confirm(`你确定要删除标签【${row.name}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableLoading = true
        tagDelete(row.id)
          .then(res => {
            // 移除数据
            this.tableData.forEach((item, index) => {
              if (item.id == res.data.id) {
                this.tableData.splice(index, 1)
              }
            })
            this.total -= 1
            this.$message.success('删除成功')
          })
          .finally(res => {
            this.tableLoading = false
          })
      })
    },
    // 执行搜索
    handleFilter () {
      this.page = 1
      this.tagList()
    }
  }
}
</script>
