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
      <el-form-item label="恢复方式" prop="mode">
        <div class="recovery-mode-options">
          <el-radio-group v-model="postForm.mode">
            <el-radio :label="1">条件恢复</el-radio>
            <!-- <el-radio :label="2">延迟恢复</el-radio> -->
          </el-radio-group>
        </div>
        <div v-show="postForm.mode == 1" class="recovery-mode-box">
          <condition-rule :conditions="postForm.conditions" :operators="operators" />
        </div>
        <div v-show="postForm.mode == 2" class="recovery-mode-box">
          <el-input-number v-model="postForm.delay_interval" :min="1" size="mini" style="width: 100px" />
          分钟内未收到新的告警，告警将自动恢复
        </div>
      </el-form-item>
    </div>

    <el-form-item>
      <el-button type="primary" @click="$emit('change-active', 'template')">下一步</el-button>
      <el-button type="primary" @click="$emit('change-active', 'upgrade')">上一步</el-button>
      <el-button type="success" @click="$emit('submmit-form')">保存</el-button>
      <el-button @click="$emit('go-back')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { formatNumber } from '@/utils/helpers'
import ConditionRule from './ConditionRule'
import { operators, OP_EQ_SELF } from '@/consts/alarm'

// 过滤掉告警自动恢复不支持的条件操作符
const recoveryOperators = {}
for (const op in operators) {
  if ([OP_EQ_SELF].indexOf(op) === -1) {
    recoveryOperators[op] = operators[op]
  }
}

export default {
  name: 'CreateRecovery',
  components: { ConditionRule },
  model: {
    prop: 'postForm'
  },
  props: {
    postForm: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      operators: recoveryOperators
    }
  },
  methods: {
    // 格式化recovery表单
    getFormData () {
      const recovery = {
        enable: this.postForm.enable,
        mode: this.postForm.mode,
        conditions: this.postForm.conditions,
        delay_interval: this.postForm.delay_interval
      }
      return recovery
    },
    // 初始化自动恢复数据
    initForm (task) {
      const enable = task.recovery ? !!task.recovery.enable : false
      const recovery = {
        enable: enable,
        mode: enable ? formatNumber(task.recovery.mode, 1) : 1,
        delay_interval: enable ? formatNumber(task.recovery.delay_interval, 0) : 0,
        conditions: enable ? task.recovery.conditions || [] : []
      }
      return recovery
    }
  }
}
</script>

<style lang="scss">

</style>
