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

      <el-form-item label="监控频率" prop="monitor_frequency">
        <el-select v-model="postForm.monitor_frequency" placeholder="请选择监控频率">
          <el-option
            v-for="(title, time) in PD_MONITOR_FREQUENCIES"
            :key="time"
            :label="title"
            :value="Number(time)">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="监控协议" prop="protocol">
        <el-select v-model="postForm.protocol" placeholder="请选择监控协议">
          <el-option
            v-for="(title, protocol) in PD_PROTOCOLS"
            :key="protocol"
            :label="title"
            :value="Number(protocol)">
          </el-option>
        </el-select>
      </el-form-item>

      <component
        v-if="postForm.protocol"
        v-model="postForm.config"
        ref="config"
        class="component-config"
        :is="configCompMap[postForm.protocol]"
        @set-config="setConfig" />

      <el-form-item label="告警条件" prop="alarmConditions" style="margin-top: 20px">
        <alarm-condition-rule
          ref="alarmCondition"
          :conditions="postForm.alarm_condition.conditions"
          :protocol="postForm.protocol" />
      </el-form-item>

      <el-form-item>
        <el-button v-if="postForm.id" type="primary" @click="updateTask" :loading="formLoading">保存</el-button>
        <el-button v-else type="primary" @click="storeTask" :loading="formLoading">创建</el-button>
        <el-button type="success" @click="validConnect" :loading="formLoading">测试</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { showTask, storeTask, updateTask, validConnect } from '@/api/monitor/protocoldetect'
import { simpleTasks } from '@/api/alarmtask'
import { formatInObjectNumber, formatInArrayNumber } from '@/utils/helpers'
import {
  PD_MONITOR_FREQUENCIES,
  PD_PROTOCOLS,
  PD_PROTOCOL_HTTP
} from '@/consts/monitor'
import AlarmConditionRule from './component/AlarmConditionRule'
import CreateHttp from './component/CreateHttp'

export default {
  name: 'MonitorProtocolDetectCreate',
  components: {
    CreateHttp, AlarmConditionRule
  },
  data () {
    return {
      postForm: {
        id: null,
        name: null,
        remark: null,
        task_id: null,
        protocol: PD_PROTOCOL_HTTP,
        monitor_frequency: null,
        config: {},
        alarm_condition: {
          conditions: []
        }
      },
      rules: {},
      PD_MONITOR_FREQUENCIES,
      PD_PROTOCOLS,
      formLoading: false,
      searchAlarmTaskLoading: false,
      alarmtasks: [],
      configCompMap: {
        [PD_PROTOCOL_HTTP]: CreateHttp
      }
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
  methods: {
    // 创建
    storeTask () {
      if (this.validPostData() === false) {
        return
      }
      const data = this.getPostData()

      this.formLoading = true
      storeTask(data)
        .then(res => {
          this.$message.success('创建成功')
          this.$router.push({ name: 'MonitorProtocolDetect' })
        }).finally(() => {
          this.formLoading = false
        })
    },
    // 从表单数据中提取可以请求接口的数据
    getPostData () {
      const data = {
        task_id: this.postForm.task_id,
        name: this.postForm.name,
        remark: this.postForm.remark,
        protocol: this.postForm.protocol,
        monitor_frequency: this.postForm.monitor_frequency,
        config: this.$refs.config.getFormData(),
        alarm_condition: this.postForm.alarm_condition
      }
      return data
    },
    // 校验表单数据是否合法
    validPostData () {
      const errors = []
      if (!this.postForm.name) {
        errors.push('告警组名称不能为空')
      }

      // 配置信息
      try {
        this.$refs.config.getFormData()
      } catch (e) {
        errors.push(e.message)
      }

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
          const task = formatInObjectNumber(res.data.task, ['id', 'task_id', 'protocol', 'monitor_frequency'])
          this.$set(this.postForm, 'protocol', task.protocol)
          this.$nextTick(() => {
            task['config'] = this.$refs.config.initEditForm(task.config)
            this.postForm = task
          })

          if (res.data.task.task) {
            this.alarmtasks.push({
              id: res.data.task.task.id,
              name: res.data.task.task.name
            })
          }
        })
    },
    // 更新
    updateTask () {
      if (this.validPostData() === false) {
        return
      }
      const data = this.getPostData()
      data['id'] = this.postForm.id

      this.formLoading = true
      updateTask(data)
        .then(res => {
          this.$message.success('更新成功')
          this.$router.push({ name: 'MonitorProtocolDetect' })
        }).finally(() => {
          this.formLoading = false
        })
    },
    goBack () {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push({ name: 'MonitorProtocolDetect' })
    },
    // 设置config的值
    setConfig (config) {
      this.$set(this.postForm, 'config', JSON.parse(JSON.stringify(config)))
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
    // 验证连接
    validConnect () {
      // 配置信息
      let data = {}
      try {
        data = {
          protocol: this.postForm.protocol,
          config: this.$refs.config.getFormData()
        }
      } catch (e) {
        this.$message.error(e.message)
        return
      }

      validConnect(data)
        .then(res => {
          if (res.data.success) {
            this.$message.success('验证通过')
          } else {
            switch (data.protocol) {
              case PD_PROTOCOL_HTTP:
                this.$message.warning(`验证通过，但相应状态码为：${res.data.http.status_code}，响应body为：${res.data.http.body_sample}`)
                break

              default:
                this.$message.success('验证通过')
                break
            }
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.component-config {
  padding: 10px 10px 0 0;
  border: 2px dashed #eee;
}
</style>
