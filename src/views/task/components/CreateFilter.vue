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
      <el-form-item label="未命中过滤" prop="not_match">
        <el-radio-group v-model="postForm.not_match">
          <el-radio :label="1">直接入库</el-radio>
          <el-radio :label="0">丢弃告警</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="过滤模式" prop="mode">
        <el-radio-group v-model="postForm.mode">
          <el-radio :label="1">白名单模式</el-radio>
          <el-radio :label="2">黑名单模式</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="过滤条件" prop="conditions">
        <condition-rule
          :conditions="postForm.conditions"
          :ruleTpl="ruleTpl"
          :operators="operators" >
          <template #header="{ orForm }">
            <div style="border-bottom: 1px solid #d3d3d3">
              告警级别：
              <el-select v-model="orForm.level" placeholder="请选择" size="small" style="width: 15%">
                <el-option
                  v-for="(title, key) in levels"
                  :key="key"
                  :label="title"
                  :value="Number(key)">
                </el-option>
              </el-select>
            </div>
          </template>
        </condition-rule>
      </el-form-item>
    </div>

    <el-form-item>
      <el-button type="primary" @click="$emit('change-active', 'compress')">下一步</el-button>
      <el-button type="primary" @click="$emit('change-active', 'workflow')">上一步</el-button>
      <el-button type="success" @click="$emit('submmit-form')">保存</el-button>
      <el-button @click="$emit('go-back')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { formatNumber } from '@/utils/helpers'
import ConditionRule from './ConditionRule'
import { levels, LEVEL_EXTEND, operators, OP_EQ_SELF } from '@/consts/alarm'

// 过滤掉告警过滤不支持的条件操作符
const filterOperators = {}
for (const op in operators) {
  if ([OP_EQ_SELF].indexOf(op) === -1) {
    filterOperators[op] = operators[op]
  }
}

export default {
  name: 'CreateFilter',
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
      operators: filterOperators,
      levels: levels,
      ruleTpl: {
        level: LEVEL_EXTEND
      }
    }
  },
  methods: {
    // 格式化filter表单
    getFormData () {
      const filter = {
        enable: this.postForm.enable,
        mode: this.postForm.mode,
        not_match: this.postForm.not_match,
        conditions: this.postForm.conditions
      }
      return filter
    },
    // 初始化告警过滤数据
    initForm (task) {
      const enable = task.filter ? !!task.filter.enable : false
      const filter = {
        enable: enable,
        mode: enable ? formatNumber(task.filter.mode, 1) : 1,
        conditions: enable ? task.filter.conditions || [] : [],
        not_match: enable ? formatNumber(task.filter.not_match, 1) : 1
      }
      return filter
    }
  }
}
</script>

<style lang="scss">

</style>
