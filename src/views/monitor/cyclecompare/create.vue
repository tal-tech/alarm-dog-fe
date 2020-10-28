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
            v-for="(title, time) in CC_AGG_CYCLES"
            :key="time"
            :label="title"
            :value="Number(time)">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="参考周期" prop="compare_cycle">
        <el-select v-model="postForm.compare_cycle" placeholder="请选择参考周期">
          <el-option
            v-for="(title, time) in CC_COMPARE_CYCLES"
            :key="time"
            :label="title"
            :value="Number(time)">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="postForm.id" label="数据初始化" prop="data_init">
        <div>
          <el-radio-group v-model="postForm.data_init.method">
            <el-radio
              v-for="(title, method) in CC_DATA_INIT_METHODS"
              :key="method"
              :label="method">{{ title }}</el-radio>
          </el-radio-group>
        </div>
        <div>
          <el-tag v-if="postForm.is_data_init" type="success" size="small">已初始化</el-tag>
          <el-tag v-else type="danger" size="small">未初始化</el-tag>
          <template v-if="postForm.data_init.init_time">
            初始化时间：<code class="highlight">{{ postForm.data_init.init_time | formatDate }}</code>
          </template>
        </div>
        <div v-if="postForm.data_init.method == CC_DATA_INIT_METHOD_WEBHOOK">
          初始化URL：
          <el-input
            v-model="postForm.data_init.webhook"
            size="small"
            placeholder="必须是合法的URL，以http://或https://开头"
            style="width: 60%" />
          <el-button type="primary" size="small" @click="dataInitByWebhook">
            初始化
          </el-button>
          <br>
          数据格式规范请参考Wiki：
          <el-link
            type="primary"
            :underline="false"
            href="https://wiki.zhiyinlou.com/pages/viewpage.action?pageId=64544303#webhook%E4%B8%BB%E5%8A%A8%E5%88%9D%E5%A7%8B%E5%8C%96"
            target="_blank">
            Webhook主动初始化
          </el-link>
        </div>
        <div v-if="postForm.data_init.method == CC_DATA_INIT_METHOD_PUSH">
          PUSH地址：
          <code class="highlight">{{ postForm.data_init_push_url }}</code>
          <el-button type="success" size="mini" v-clipboard:copy="postForm.data_init_push_url" v-clipboard:success="copySuccess">
            复制
          </el-button>
          <br>
          数据格式规范请参考Wiki：
          <el-link
            type="primary"
            :underline="false"
            href="https://wiki.zhiyinlou.com/pages/viewpage.action?pageId=64544303#push%E8%A2%AB%E5%8A%A8%E5%88%9D%E5%A7%8B%E5%8C%96"
            target="_blank">
            Push被动初始化
          </el-link>
        </div>
        <div v-if="postForm.data_init.method == CC_DATA_INIT_METHOD_DATASOURCE">
          <el-button type="primary" size="small" @click="dataInitByDatasource">
            从数据源初始化
          </el-button>
        </div>
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
import { showTask, storeTask, updateTask, dataInitByWebhook, dataInitByDatasource } from '@/api/monitor/cyclecompare'
import { simpleTasks } from '@/api/alarmtask'
import { simpleDatasources, getFields } from '@/api/monitor/datasource'
import { formatInObjectNumber, formatInArrayNumber } from '@/utils/helpers'
import { formatDate } from '@/utils/filters'
import {
  CC_AGG_CYCLES,
  CC_COMPARE_CYCLES,
  CC_DATA_INIT_METHOD_WEBHOOK,
  CC_DATA_INIT_METHOD_PUSH,
  CC_DATA_INIT_METHOD_DATASOURCE,
  CC_DATA_INIT_METHODS,
  DS_TYPE_ES
} from '@/consts/monitor'
import FilterConditionRule from './component/FilterConditionRule'
import AlarmConditionRule from './component/AlarmConditionRule'
import clipboard from '@/directive/clipboard/index.js'

export default {
  name: 'MonitorCycleCompareCreate',
  components: {
    FilterConditionRule, AlarmConditionRule
  },
  directives: { clipboard },
  filters: { formatDate },
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
        data_init: {
          method: null,
          init_time: null
        },
        alarm_condition: {
          conditions: []
        }
      },
      rules: {},
      CC_AGG_CYCLES,
      CC_COMPARE_CYCLES,
      CC_DATA_INIT_METHOD_WEBHOOK,
      CC_DATA_INIT_METHOD_PUSH,
      CC_DATA_INIT_METHOD_DATASOURCE,
      CC_DATA_INIT_METHODS,
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
          this.$router.push({ name: 'MonitorCycleCompare' })
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
          const form = formatInObjectNumber(res.data.task, ['id', 'task_id', 'datasource_id', 'agg_cycle', 'is_data_init'])
          if (!form['data_init']) {
            form['data_init'] = {}
          }
          this.postForm = form

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
            this.$alert('更新成功，但数据源验证出错，请关注：' + res.data.error.error, '任务创建警告', {
              confirmButtonText: '我知道了',
              type: 'warning'
            })
          } else {
            this.$message.success('更新成功')
          }
          this.$router.push({ name: 'MonitorCycleCompare' })
        }).finally(() => {
          this.formLoading = false
        })
    },
    goBack () {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push({ name: 'MonitorCycleCompare' })
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
    // 复制成功
    copySuccess () {
      this.$message.success('复制成功')
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
    },
    // 通过webhook初始化数据
    dataInitByWebhook () {
      if (!this.postForm.data_init.webhook) {
        this.$message.error('请填写初始化数据的webhook地址')
        return
      }

      const loading = this.$loading()
      dataInitByWebhook(this.postForm.id, this.postForm.data_init.webhook)
        .then(res => {
          this.$set(this.postForm, 'data_init', res.data)
          this.$set(this.postForm, 'is_data_init', 1)
          this.$message.success('初始化成功')
        }).finally(() => {
          loading.close()
        })
    },
    // 通过datasource初始化数据
    dataInitByDatasource () {
      const loading = this.$loading()
      dataInitByDatasource(this.postForm.id)
        .then(res => {
          this.$set(this.postForm, 'data_init', res.data)
          this.$set(this.postForm, 'is_data_init', 1)
          this.$message.success('初始化成功')
        }).finally(() => {
          loading.close()
        })
    }
  }
}
</script>
