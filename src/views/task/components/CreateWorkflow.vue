<template>
  <el-form :model="postForm" class="form-container" label-width="120px" ref="form">
    <el-form-item label="状态" prop="enable">
      <el-switch
        v-model="postForm.enable"
        active-color="#13ce66"
        inactive-color="#ff4949">
      </el-switch>
    </el-form-item>

    <div v-show="postForm.enable">
      <el-form-item label="提醒" prop="reminds">
        <div class="workflow-control">
          <el-button type="primary" size="mini" @click="addRemind">添加提醒</el-button>
        </div>
        <el-card v-for="(remind, index) in postForm.reminds" :key="index" class="box-card" style="margin-top: 20px">
          <div slot="header" class="clearfix">
            <div style="display: inline-block">
              <el-select v-model="remind.status" placeholder="请选择" size="mini" style="width: 90px">
                <el-option
                  v-for="(title, status) in statuses"
                  :key="status"
                  :label="title"
                  :value="Number(status)">
                </el-option>
              </el-select>
              状态时告警发送之后
              <el-input-number v-model="remind.interval" :min="1" size="mini" style="width: 100px" />
              分钟无人处理，将通知：
            </div>
            <close-button style="float: right; padding: 10px 0" @click="removeRemind(index)" />
          </div>
          <el-checkbox v-model="remind.reuse_receiver">复用告警通知人</el-checkbox>
          <el-checkbox v-model="remind.enable_cycle">周期循环</el-checkbox>

          <div v-show="!remind.reuse_receiver">
            <el-alert
              title="告警组与自定义通知渠道配置会进行合并处理，二者可都配置，可二选一配置"
              type="info"
              :closable="false"
              style="margin-bottom: 20px"
              show-icon />
            <create-receiver-item
              v-model="remind.receiver"
              ref="createReceiverItem"
              :showGroupFocus="false" />
          </div>
        </el-card>
      </el-form-item>
    </div>

    <el-form-item>
      <el-button type="primary" @click="$emit('change-active', 'filter')">下一步</el-button>
      <el-button type="primary" @click="$emit('change-active', 'receiver')">上一步</el-button>
      <el-button type="success" @click="$emit('submmit-form')">保存</el-button>
      <el-button @click="$emit('go-back')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import AddMembersSelect from '@/views/components/AddMembers/Select'
import AddAlarmGroupsSelect from '@/views/components/AddAlarmGroups/Select'
import AlarmGroupChannelCreate from '@/views/alarm-manage/group/components/ChannelCreate'
import { formatNumber } from '@/utils/helpers'
import CloseButton from './CloseButton'
import CreateReceiverItem from './CreateReceiverItem'
import {
  WORKFLOW_STATUS_PENDING,
  WORKFLOW_STATUS_PROCESSING,
  workflowStatuses
} from '@/consts/alarm'

export default {
  name: 'CreateWorkflow',
  components: {
    AddMembersSelect, AddAlarmGroupsSelect, AlarmGroupChannelCreate, CloseButton, CreateReceiverItem
  },
  model: {
    prop: 'postForm'
  },
  props: {
    postForm: {
      type: Object,
      required: true
    },
    receiverTemplate: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      statuses: {
        [WORKFLOW_STATUS_PENDING]: workflowStatuses[WORKFLOW_STATUS_PENDING],
        [WORKFLOW_STATUS_PROCESSING]: workflowStatuses[WORKFLOW_STATUS_PROCESSING]
      }
    }
  },
  created () {
  },
  methods: {
    // 添加提醒
    addRemind () {
      this.postForm.reminds.push({
        status: null,
        interval: 10,
        enable_cycle: true,
        reuse_receiver: true,
        receiver: JSON.parse(JSON.stringify(this.receiverTemplate))
      })
    },
    // 移除提醒面板
    removeRemind (index) {
      this.postForm.reminds.splice(index, 1)
    },
    // 格式化表单
    getFormData (createReceiverItem) {
      const workflow = {
        enable: this.postForm.enable,
        reminds: []
      }
      if (workflow.enable) {
        this.postForm.reminds.forEach(remind => {
          const wRemind = {
            mode: remind.enable_cycle ? 'cycle' : 'once',
            status: remind.status,
            interval: remind.interval,
            reuse_receiver: remind.reuse_receiver ? 1 : 0
          }
          if (!remind.reuse_receiver) {
            wRemind['receiver'] = createReceiverItem.getFormData(remind.receiver, false)
          }
          workflow.reminds.push(wRemind)
        })
      }
      return workflow
    },
    // 初始化填充表单
    initForm (task, createReceiverItem) {
      const enable = task.workflow ? !!task.workflow.enable : false
      const workflow = {
        enable: enable,
        reminds: []
      }
      if (enable && task.workflow.reminds) {
        task.workflow.reminds.forEach(remind => {
          workflow.reminds.push({
            status: formatNumber(remind.status, null),
            interval: formatNumber(remind.interval, 0),
            enable_cycle: remind.mode != 'once',
            reuse_receiver: !!remind.reuse_receiver,
            receiver: createReceiverItem.initForm(!remind.reuse_receiver && remind.receiver ? remind.receiver : {})
          })
        })
      }
      return workflow
    }
  }
}
</script>

<style lang="scss">

</style>
