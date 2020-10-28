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
      <el-form-item label="升级策略" prop="strategies">
        <div class="strategies-control">
          <el-button type="primary" size="mini" @click="addStrategy">添加策略</el-button>
        </div>
        <el-card v-for="(strategy, index) in postForm.strategies" :key="index" class="box-card" style="margin-top: 20px">
          <div slot="header" class="clearfix">
            <div style="display: inline-block">
              <el-input-number v-model="strategy.interval" :min="1" size="mini" style="width: 100px" />
              分钟内告警达到
              <el-input-number v-model="strategy.count" :min="1" size="mini" style="width: 100px" />
              条后，告警升级为
              <el-select v-model="strategy.level" placeholder="请选择" size="mini" style="width: 90px">
                <el-option
                  v-for="(title, level) in levels"
                  :key="level"
                  :label="title"
                  :value="Number(level)">
                </el-option>
              </el-select>
              ，将通知：
            </div>
            <close-button style="float: right; padding: 10px 0" @click="removeStrategy(index)" />
          </div>
          <el-checkbox v-model="strategy.reuse_receiver">复用告警通知人</el-checkbox>

          <div v-show="!strategy.reuse_receiver">
            <el-alert
              title="告警组与自定义通知渠道配置会进行合并处理，二者可都配置，可二选一配置"
              type="info"
              :closable="false"
              style="margin-bottom: 20px"
              show-icon />
            <create-receiver-item
              v-model="strategy.receiver"
              ref="createReceiverItem"
              :showGroupFocus="false" />
          </div>

        </el-card>
      </el-form-item>
    </div>

    <el-form-item>
      <el-button type="primary" @click="$emit('change-active', 'recovery')">下一步</el-button>
      <el-button type="primary" @click="$emit('change-active', 'compress')">上一步</el-button>
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
import { levelsNoExtend } from '@/consts/alarm'

export default {
  name: 'CreateUpgrade',
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
      levels: levelsNoExtend
    }
  },
  methods: {
    // 添加策略
    addStrategy () {
      this.postForm.strategies.push({
        count: null,
        interval: null,
        level: null,
        reuse_receiver: false,
        receiver: JSON.parse(JSON.stringify(this.receiverTemplate))
      })
    },
    // 移除策略面板
    removeStrategy (index) {
      this.postForm.strategies.splice(index, 1)
    },
    // 格式化upgrade表单
    getFormData (createReceiverItem) {
      const upgrade = {
        enable: this.postForm.enable,
        strategies: []
      }
      if (upgrade.enable) {
        this.postForm.strategies.forEach(strategy => {
          const wStrateby = {
            interval: strategy.interval,
            count: strategy.count,
            level: strategy.level,
            reuse_receiver: strategy.reuse_receiver ? 1 : 0
          }
          if (!strategy.reuse_receiver) {
            wStrateby['receiver'] = createReceiverItem.getFormData(strategy.receiver)
          }
          upgrade.strategies.push(wStrateby)
        })
      }
      return upgrade
    },
    // 初始化填充表单数据
    initForm (task, createReceiverItem) {
      const enable = task.upgrade ? !!task.upgrade.enable : false
      const upgrade = {
        enable: enable,
        strategies: []
      }
      if (enable && task.upgrade.strategies) {
        task.upgrade.strategies.forEach(strategy => {
          upgrade.strategies.push({
            interval: formatNumber(strategy.interval, 0),
            count: formatNumber(strategy.count, 0),
            level: formatNumber(strategy.level, null),
            reuse_receiver: !!strategy.reuse_receiver,
            receiver: createReceiverItem.initForm(!strategy.reuse_receiver && strategy.receiver ? strategy.receiver : {})
          })
        })
      }
      return upgrade
    }
  }
}
</script>

<style lang="scss">

</style>
