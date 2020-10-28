<template>
  <el-form :model="postForm" class="form-container" label-width="120px" ref="form">
    <el-alert
      title="告警组与自定义通知渠道配置会进行合并处理，二者可都配置，可二选一配置"
      type="info"
      :closable="false"
      style="margin-bottom: 20px"
      show-icon />
    <create-receiver-item
      v-model="postForm"
      ref="createReceiverItem"
      :showGroupFocus="false" />

    <el-form-item label="分级告警" prop="dispatch">
      <div class="dispath-switch">
        <el-switch
          v-model="enableDispatch"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="true"
          :inactive-value="false" />
      </div>
      <div class="dispatch-control" v-show="enableDispatch">
        <el-button type="primary" size="mini" @click="addDispatchReceiver">添加分级告警通知人</el-button>
        <el-radio-group v-model="postForm.mode" style="margin-left: 20px">
          <el-radio
            v-for="(title, mode) in RECV_DISPATCH_MODES"
            :key="mode"
            :label="Number(mode)">{{ title }}</el-radio>
        </el-radio-group>
      </div>
    </el-form-item>
    <el-collapse v-show="enableDispatch" v-model="modelCollapse" class="box-collapse" style="margin-bottom: 20px">
      <el-collapse-item
        v-for="(dispatch, index) in postForm.dispatch"
        :key="index"
        :name="`dispatch${dispatch.counter}`">
        <template slot="title">
          <el-button
            type="warning"
            size="mini"
            style="margin-right: 10px;"
            @click.stop="removeDispatchReceiver(index, dispatch.counter)">
            移除分级告警
          </el-button>
          分级告警{{ dispatch.counter }}
        </template>

        <condition-rule
          :conditions="dispatch.conditions"
          :operators="operators" />

        <create-receiver-item v-model="dispatch.receiver" :showGroupFocus="false" />
      </el-collapse-item>
    </el-collapse>

    <el-form-item>
      <el-button type="primary" @click="$emit('change-active', 'workflow')">下一步</el-button>
      <el-button type="primary" @click="$emit('change-active', 'basic')">上一步</el-button>
      <el-button type="success" @click="$emit('submmit-form')">保存</el-button>
      <el-button @click="$emit('go-back')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import AddAlarmGroupsSelect from '@/views/components/AddAlarmGroups/Select'
import AlarmGroupChannelCreate from '@/views/alarm-manage/group/components/ChannelCreate'
import ConditionRule from './ConditionRule'
import CreateReceiverItem from './CreateReceiverItem'
import {
  operators,
  OP_EQ_SELF,
  RECV_DISPATCH_MODE_LAZY,
  RECV_DISPATCH_MODE_UNLAZY,
  RECV_DISPATCH_MODES
} from '@/consts/alarm'

// 过滤掉告警过滤不支持的条件操作符
const filterOperators = {}
for (const op in operators) {
  if ([OP_EQ_SELF].indexOf(op) === -1) {
    filterOperators[op] = operators[op]
  }
}

export default {
  name: 'CreateReceiverModule',
  components: {
    AddAlarmGroupsSelect, AlarmGroupChannelCreate, ConditionRule, CreateReceiverItem
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
      operators: filterOperators,
      dispatchIndex: 1,
      modelCollapse: [],
      RECV_DISPATCH_MODE_LAZY,
      RECV_DISPATCH_MODE_UNLAZY,
      RECV_DISPATCH_MODES,
      enableDispatch: false
    }
  },
  watch: {
    enableDispatch (val) {
      if (val && this.postForm.dispatch.length === 0) {
        this.addDispatchReceiver()
      }
    }
  },
  methods: {
    // 添加分级告警通知人
    addDispatchReceiver () {
      const counter = this.dispatchIndex++
      this.postForm.dispatch.push({
        counter: counter,
        conditions: [],
        receiver: JSON.parse(JSON.stringify(this.receiverTemplate))
      })

      // 默认展开新的面板
      this.modelCollapse.push(`dispatch${counter}`)
    },
    // 移除分级告警通知人
    removeDispatchReceiver (index, counter) {
      this.postForm.dispatch.splice(index, 1)

      // 自动移除折叠面板的name
      this.modelCollapse.forEach((item, itemIndex) => {
        if (item == `dispatch${counter}`) {
          this.modelCollapse.splice(itemIndex, 1)
        }
      })
    },
    // 获取提交数据
    getFormData () {
      const receiver = this.$refs.createReceiverItem.getFormData(this.postForm, true)

      const dispatch = []
      if (this.enableDispatch) {
        this.postForm.dispatch.forEach(item => {
          dispatch.push({
            conditions: item.conditions,
            receiver: this.$refs.createReceiverItem.getFormData(item.receiver, true)
          })
        })
      }

      receiver['mode'] = this.postForm.mode
      receiver['dispatch'] = dispatch

      return receiver
    },
    // 初始化填充该组件表单字段
    initForm (task) {
      const receiver = this.$refs.createReceiverItem.initForm(task.receiver)

      const dispatch = []
      task.receiver.dispatch.forEach(item => {
        dispatch.push({
          counter: this.dispatchIndex++,
          conditions: item.conditions,
          receiver: this.$refs.createReceiverItem.initForm(item.receiver)
        })
      })
      receiver['dispatch'] = dispatch
      receiver['mode'] = task.receiver.mode ? Number(task.receiver.mode) : RECV_DISPATCH_MODE_LAZY

      if (dispatch.length > 0) {
        this.enableDispatch = true
      }

      return receiver
    }
  }
}
</script>

<style lang="scss">

</style>
