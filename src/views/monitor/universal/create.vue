<template>
  <div class="app-container">
    <el-form v-model="postForm" class="form-container" label-width="120px" ref="form" :rules="rules">
      <el-form-item label="监控任务名称" prop="name">
        <el-input v-model="postForm.name"/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="postForm.remark" type="textarea"/>
      </el-form-item>
      <el-form-item label="关联告警任务" prop="task_id">
        <el-select
          v-model="postForm.task_id"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词搜索告警任务"
          :remote-method="searchAlarmTask"
          :loading="searchAlarmTaskLoading"
          style="width: 45%">
          <el-option
            v-for="alaramtask in alarmtasks"
            :key="alaramtask.id"
            :label="alaramtask.name"
            :value="Number(alaramtask.id)">
          </el-option>
        </el-select>

        <router-link
          v-if="postForm.task_id"
          tag="a"
          target="_blank"
          :to="{ name: 'AlarmTaskShow', params: { taskId: postForm.task_id }}">
          <el-button type="primary">
            查看告警任务详情
          </el-button>
        </router-link>
      </el-form-item>
      <el-form-item label="数据源" prop="datasource_id">
        <el-select
          v-model="postForm.datasource_id"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词搜索数据源"
          :remote-method="searchDatasource"
          :loading="searchDatasourceLoading"
          style="width: 45%"
          @change="handleSelectDatasource">
          <el-option
            v-for="datasource in datasources"
            :key="datasource.id"
            :label="datasource.name"
            :value="Number(datasource.id)">
          </el-option>
        </el-select>

        <router-link
          v-if="postForm.datasource_id"
          tag="a"
          target="_blank"
          :to="{ name: 'MonitorDatasourceEdit', params: { datasourceId: postForm.datasource_id }}">
          <el-button type="primary">
            查看数据源详情
          </el-button>
        </router-link>

        <span v-show="showEsWarning" style="color: red">ElasticSearch是近实时存储，在流量高峰可能存在数据计算不准确的风险</span>
      </el-form-item>

      <el-form-item label="聚合周期" prop="agg_cycle">
        <el-select v-model="postForm.agg_cycle" placeholder="请选择聚合周期">
          <el-option
            v-for="(title, time) in US_AGG_CYCLES"
            :key="time"
            :label="title"
            :value="Number(time)">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="过滤条件" prop="filterConditions">
        <el-button
          v-show="postForm.config.filter.conditions.length === 0"
          type="primary"
          size="mini"
          @click="addFilterCondition">
          添加条件
        </el-button>
        <filter-condition-rule
          ref="filterCondition"
          :conditions="postForm.config.filter.conditions"
          :fields="alarmFields" />
      </el-form-item>
      <el-form-item label="告警条件" prop="alarmConditions">
        <alarm-condition-rule
          ref="alarmCondition"
          :conditions="postForm.alarm_condition.conditions"
          :fields="alarmFields" />
      </el-form-item>

      <el-form-item>
        <el-button v-if="postForm.id" type="primary" @click="updateTask" :loading="formLoading">保存</el-button>
        <el-button v-else type="primary" @click="storeTask" :loading="formLoading">创建</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { showTask, storeTask, updateTask } from '@/api/monitor/universal'
import { simpleTasks } from '@/api/alarmtask'
import { simpleDatasources, getFields } from '@/api/monitor/datasource'
import { formatInObjectNumber, formatInArrayNumber } from '@/utils/helpers'
import {
  US_AGG_CYCLES,
  DS_TYPE_ES
} from '@/consts/monitor'
import FilterConditionRule from './component/FilterConditionRule'
import AlarmConditionRule from './component/AlarmConditionRule'

export default {
  name: 'MonitorUniversalCreate',
  components: {
    FilterConditionRule, AlarmConditionRule
  },
  data () {
    return {
      postForm: {
        id: null,
        name: null,
        remark: null,
        task_id: null,
        datasource_id: null,
        agg_cycle: null,
        config: {
          filter: {
            conditions: []
          }
        },
        alarm_condition: {
          conditions: []
        }
      },
      rules: {},
      US_AGG_CYCLES,
      formLoading: false,
      searchAlarmTaskLoading: false,
      searchDatasourceLoading: false,
      alarmtasks: [],
      datasources: [],
      alarmFields: [] // 告警可用字段
    }
  },
  created () {
    if (this.$route.params['taskId']) {
      this.$set(this.postForm, 'id', Number(this.$route.params['taskId']))
      this.showTask()
    } else {
      this.setDefaultsTpl = true
    }
  },
  computed: {
    showEsWarning () {
      if (this.postForm.datasource && this.postForm.datasource_id == this.postForm.datasource.id) {
        return this.postForm.datasource.type == DS_TYPE_ES
      }

      for (let i = 0; i < this.datasources.length; i++) {
        if (this.datasources[i].id == this.postForm.datasource_id) {
          return this.datasources[i].type == DS_TYPE_ES
        }
      }

      return false
    }
  },
  methods: {
    // 创建
    storeTask () {
      const data = this.getPostData()

      if (this.validPostData(data) === false) {
        return
      }

      this.formLoading = true
      storeTask(data)
        .then(res => {
          if (res.data.error.error) {
            this.$alert('创建成功，但数据源验证出错，请关注：' + res.data.error.error, '任务创建警告', {
              confirmButtonText: '我知道了',
              type: 'warning'
            })
          } else {
            this.$message.success('创建成功')
          }
          this.$router.push({ name: 'MonitorUniversal' })
        }).finally(() => {
          this.formLoading = false
        })
    },
    // 从表单数据中提取可以请求接口的数据
    getPostData () {
      return this.postForm
    },
    // 校验表单数据是否合法
    validPostData (data) {
      const errors = []
      if (!data.name) {
        errors.push('监控任务名称不能为空')
      }
      // TODO

      if (errors.length > 0) {
        this.$message({ type: 'error', message: errors.join('<br>'), dangerouslyUseHTMLString: true })
        return false
      }
      return true
    },
    // 获取详情
    showTask () {
      showTask(this.postForm.id)
        .then(res => {
          this.postForm = formatInObjectNumber(res.data.task, ['id', 'task_id', 'datasource_id', 'agg_cycle'])
          this.datasources.push({
            id: res.data.task.datasource.id,
            type: res.data.task.datasource.type,
            name: res.data.task.datasource.name,
            remark: res.data.task.datasource.remark,
            config: res.data.task.datasource.config
          })

          if (res.data.task.task) {
            this.alarmtasks.push({
              id: res.data.task.task.id,
              name: res.data.task.task.name
            })
          }

          // 初始化告警字段
          this.$nextTick(() => {
            this.handleSelectDatasource()
          })
        })
    },
    // 更新
    updateTask () {
      const data = this.getPostData()
      data['id'] = this.postForm.id

      if (this.validPostData(data) === false) {
        return
      }

      this.formLoading = true
      updateTask(data)
        .then(res => {
          if (res.data.error.error) {
            this.$alert('更新成功，但数据源验证出错，请关注：' + res.data.error.error, '任务更新警告', {
              confirmButtonText: '我知道了',
              type: 'warning'
            })
          } else {
            this.$message.success('更新成功')
          }
          this.$router.push({ name: 'MonitorUniversal' })
        }).finally(() => {
          this.formLoading = false
        })
    },
    goBack () {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push({ name: 'MonitorUniversal' })
    },
    // 添加过滤条件
    addFilterCondition () {
      this.$refs.filterCondition.addConditionOr()
    },
    // 远程搜索告警任务
    searchAlarmTask (query) {
      this.searchAlarmTaskLoading = true
      simpleTasks(query, 20)
        .then(res => {
          this.alarmtasks = formatInArrayNumber(res.data.tasks, ['id'])
        }).finally(() => {
          this.searchAlarmTaskLoading = false
        })
    },
    // 远程搜索数据源
    searchDatasource (query) {
      this.searchDatasourceLoading = true
      simpleDatasources(query, 20)
        .then(res => {
          this.datasources = formatInArrayNumber(res.data.datasources, ['id'])
        }).finally(() => {
          this.searchDatasourceLoading = false
        })
    },
    // 数据源选择事件
    handleSelectDatasource () {
      getFields(this.postForm.datasource_id)
        .then(res => {
          const fields = []
          fields.push({
            value: res.data.timestamp.field,
            unit: res.data.timestamp.unit,
            label: '时间'
          })
          res.data.fields.forEach(item => {
            fields.push({
              value: item.field,
              type: item.type,
              label: item.label
            })
          })

          this.alarmFields = fields
        })
    }
  }
}
</script>
