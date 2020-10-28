<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="buId" filterable clearable placeholder="请选择事业部进行筛选">
        <el-option
          v-for="businessUnit in businessUnits"
          :key="businessUnit.id"
          :label="businessUnit.name"
          :value="businessUnit.id">
        </el-option>
      </el-select>

      <el-input
        v-model="search"
        placeholder="请输入部门名称回车搜索"
        style="width: 300px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter" />
      <el-button type="primary" @click="handleFilter">筛选</el-button>

      <div class="filter-container-right clearfix">
        <el-button type="primary" icon="el-icon-plus" @click="createDepartment">创建部门</el-button>
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
        width="90"
        align="center"
      />
      <el-table-column
        label="事业部"
        width="170"
        prop="bu_id"
      >
        <template #default="{ row }">
          {{ row.business_unit ? row.business_unit.name : '关联错误' }}
        </template>
      </el-table-column>
      <el-table-column
        label="部门名称"
        prop="name"
      />
      <el-table-column
        label="备注"
        prop="remark"
      />
      <el-table-column
        label="更新时间"
        width="170"
        align="center"
      >
        <template #default="{ row }">
          {{ row.updated_at | formatDate }}
        </template>
      </el-table-column>
      <el-table-column
        label="更新人"
        width="180"
        align="center"
      >
        <template #default="{ row }">
          <user :creator="row.updator" />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="160"
      >
        <template #default="{ row }">
          <el-button type="primary" size="mini" @click="editDepartment(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteDepartment(row)">删除</el-button>
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

    <!-- 创建 / 更新部门 -->
    <el-dialog
      :title="editorData.id ? '编辑部门' : '创建部门'"
      :visible.sync="dialogEditorVisible"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form :model="editorData" class="form-container" label-width="120px" ref="form" :rules="rules">
        <el-form-item label="事业部" prop="bu_id">
          <el-select v-model="editorData.bu_id" filterable placeholder="请选择部门">
            <el-option
              v-for="businessUnit in businessUnits"
              :key="businessUnit.id"
              :label="businessUnit.name"
              :value="businessUnit.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="editorData.name"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="editorData.remark" type="textarea"/>
        </el-form-item>
        <el-form-item>
          <el-button v-if="editorData.id" type="primary" @click="updateDepartment" :loading="formLoading">保存</el-button>
          <el-button v-else type="primary" @click="storeDepartment" :loading="formLoading">创建</el-button>
          <el-button @click="dialogEditorVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { departments, storeDepartment, updateDepartment, deleteDepartment } from '@/api/department'
import { simpleBusinessUnits } from '@/api/businessUnit'
import { formatDate } from '@/utils/filters'
import { formatInArrayNumber, formatInObjectNumber } from '@/utils/helpers'
import Pagination from '@/components/Pagination'
import User from '@/views/components/User'

export default {
  name: 'AdminManageDepartment',
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
      department: {},
      dialogEditorVisible: false,
      editorData: {},
      formLoading: false,
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blue' }
        ]
      },
      businessUnits: [],
      buId: null
    }
  },
  created () {
    this.getBusinessUnits()
    this.getList()
  },
  methods: {
    getBusinessUnits () {
      simpleBusinessUnits()
        .then(res => {
          this.businessUnits = formatInArrayNumber(res.data.business_units, ['id'])
        })
    },
    getList () {
      this.tableLoading = true
      departments(this.page, this.pageSize, this.search, this.buId)
        .then(res => {
          this.page = Number(res.data.current_page)
          this.pageSize = Number(res.data.per_page)
          this.total = Number(res.data.total)
          this.tableData = formatInArrayNumber(res.data.data, ['id', 'created_at'])
        }).finally(() => {
          this.tableLoading = false
        })
    },
    // 编辑部门
    editDepartment (row) {
      this.editorData = row
      this.dialogEditorVisible = true
    },
    // 更新部门
    updateDepartment () {
      const department = {
        id: this.editorData.id,
        bu_id: this.editorData.bu_id,
        name: this.editorData.name,
        remark: this.editorData.remark
      }
      this.formLoading = true
      updateDepartment(department)
        .then(res => {
          this.dialogEditorVisible = false
          this.$message.success('更新成功')
          this.getList()
        }).finally(() => {
          this.formLoading = false
        })
    },
    // 创建部门
    createDepartment () {
      this.editorData = {}
      this.dialogEditorVisible = true
    },
    // 保存部门
    storeDepartment () {
      this.formLoading = true
      storeDepartment(this.editorData)
        .then(res => {
          this.tableData.unshift(formatInObjectNumber(res.data.department))
          this.total += 1
          this.dialogEditorVisible = false
          this.$message.success('创建成功')
        }).finally(() => {
          this.formLoading = false
        })
    },
    // 删除部门
    deleteDepartment (row) {
      this.$confirm(`你确定要删除部门【${row.name}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableLoading = true
        deleteDepartment(row.id)
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
    }
  }
}
</script>
