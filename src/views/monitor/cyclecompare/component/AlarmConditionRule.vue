<template>
  <div>
    <div v-for="(orForm, orIdx) in conditions" :key="orIdx" class="form-condition-item-container">
      <div v-if="orIdx != 0" class="controls-condition-or controls-condition-or-top">
        <span class="controls-line-vertical-or controls-line-vertical-or-top"></span>
      </div>
      <div style="border-bottom: 1px solid #d3d3d3">
        告警级别：
        <el-select v-model="orForm.level" placeholder="请选择" size="small" style="width: 15%; margin-right: 15px">
          <el-option
            v-for="(title, key) in levelsNoExtend"
            :key="key"
            :label="title"
            :value="Number(key)">
          </el-option>
        </el-select>
      </div>
      <div v-for="(andForm, andIdx) in orForm[ruleKey]" :key="andIdx" class="form-item-condition-item">
        <div v-if="andIdx != 0" class="controls-condition-and">
          <span class="controls-line controls-line-vertical"></span>
          <span class="controls-circle controls-color-gray">且</span>
        </div>
        <autocomplete
          v-model="andForm.field"
          :fields="fields"
          placeholder="指标名称"
          size="small"
          style="width: 25%" />

        <el-select v-model="andForm.agg_method" placeholder="聚合方式" size="small" style="width: 10%">
          <el-option
            v-for="(title, method) in CC_ALARM_AGGS"
            :key="method"
            :label="title"
            :value="method">
          </el-option>
        </el-select>

        <el-select v-model="andForm.operator_type" placeholder="比较方式" size="small" style="width: 10%">
          <el-option
            v-for="(title, key) in CC_ALARM_OPERATOR_TYPES"
            :key="key"
            :label="title"
            :value="key">
          </el-option>
        </el-select>

        <el-select v-model="andForm.operator" placeholder="比较条件" size="small" style="width: 10%">
          <el-option
            v-for="(title, key) in operators"
            :key="key"
            :label="title"
            :value="key">
          </el-option>
        </el-select>

        <el-select v-model="andForm.threshold_type" placeholder="阈值类型" size="small" style="width: 10%">
          <el-option
            v-for="(title, key) in CC_ALARM_THRESHOLD_TYPES"
            :key="key"
            :label="title"
            :value="key">
          </el-option>
        </el-select>

        <el-input
          v-model="andForm.threshold"
          placeholder="请输入阈值"
          size="small"
          style="width: 25%" />

        <el-button
          v-if="!(orIdx == 0 && andIdx == 0)"
          type="text"
          class="condition-item-delete"
          title="点击删除该条件"
          @click="deleteConditionItem(orIdx, andIdx)"
        >
          <i class="el-icon-delete"/>
        </el-button>
      </div>
      <div class="form-item-condition-item form-condition-item-controls">
        <div class="controls-condition-and">
          <span class="controls-line controls-line-vertical"></span>
          <span class="controls-circle controls-color-gray">且</span>
        </div>
        <div class="controls-add">
          <span class="controls-line controls-line-horizontal"></span>
          <span class="controls-circle controls-color-primary" @click="addConditionAnd(orIdx)"><i class="el-icon-plus" /></span>
        </div>
      </div>
      <div class="controls-condition-or">
        <span class="controls-line-vertical-or"></span>
        <span
          class="controls-circle"
          :class="orIdx == conditions.length - 1 ? 'controls-color-primary' : 'controls-color-gray'"
          @click="addConditionOr"
        >
          或
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  CC_ALARM_OPERATORS,
  CC_ALARM_AGGS,
  CC_ALARM_OPERATOR_TYPES,
  CC_ALARM_THRESHOLD_TYPES
} from '@/consts/monitor'
import {
  levelsNoExtend
} from '@/consts/alarm'
import Autocomplete from './Autocomplete'

export default {
  name: 'AlarmConditionRule',
  components: {
    Autocomplete
  },
  model: {
    prop: 'conditions'
  },
  props: {
    conditions: {
      type: Array,
      required: true
    },
    ruleKey: { // 条件规则的字段名称
      type: String,
      default: 'rule'
    },
    fields: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      operators: CC_ALARM_OPERATORS,
      levelsNoExtend,
      CC_ALARM_AGGS,
      CC_ALARM_OPERATOR_TYPES,
      CC_ALARM_THRESHOLD_TYPES,
      conditionItemTpl: {
        field: '', // 字段名称
        agg_method: '', // 聚合方式
        operator_type: '', // 比较方式
        operator: '', // 操作符
        threshold_type: '', // 阈值类型
        threshold: '' // 阈值
      }
    }
  },
  watch: {
    // 先用这种不靠谱的方法解决bug
    conditions (val) {
      if (val.length === 0) {
        this.addConditionOr()
      }
    }
  },
  created () {
    if (this.conditions.length === 0) {
      this.addConditionOr()
    }
  },
  methods: {
    // 删除一条规则
    deleteConditionItem (orIdx, andIdx) {
      if (this.conditions[orIdx][this.ruleKey].length <= 1) {
        this.conditions.splice(orIdx, 1)
      } else {
        this.conditions[orIdx][this.ruleKey].splice(andIdx, 1)
      }
    },
    // 添加一条and规则
    addConditionAnd (orIdx) {
      const conditionTpl = Object.assign({}, this.conditionItemTpl)
      this.conditions[orIdx][this.ruleKey].push(conditionTpl)
    },
    // 添加一条or规则
    addConditionOr () {
      const conditionTpl = Object.assign({}, this.conditionItemTpl)
      const item = {
        level: null,
        [this.ruleKey]: [conditionTpl]
      }
      this.conditions.push(item)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-condition-item-container {
  position: relative;
  padding: 5px 15px;
  margin-bottom: 68px;
  border: 1px solid #d3d3d3;
  .controls-condition-or {
    position: absolute;
    left: 0;
    right: 0;
    .controls-line-vertical-or {
      position: absolute;
      display: block;
      background: #d3d3d3;
      width: 1px;
      height: 20px;
      margin-left: 50%;
      top: 5px;
    }
    .controls-circle {
      position: absolute;
      margin-left: 50%;
      left: -15px;
      top: 25px;
    }
  }
  .controls-condition-or-top {
    .controls-line-vertical-or-top {
      top: -25px;
    }
  }
  .controls-condition-and {
    display: inline-block;
    position: relative;
    margin-right: 10px;
  }
  .controls-add {
    display: inline-block;
    position: relative;
    margin-left: 15px;
  }
  .controls-line {
     background: #d3d3d3;
     display: inline-block;
  }
  .controls-line-vertical {
    width: 1px;
    height: 21px;
    position: absolute;
    left: 15px;
    top: -16px;
  }
  .controls-line-horizontal {
    height: 1px;
    width: 30px;
    position: absolute;
    left: -30px;
    top: 20px;
  }
  .controls-circle {
    line-height: 30px;
    width: 30px;
    text-align: center;
    border-radius: 50%;
    display: inline-block;
    color: #fff;
  }
  .controls-color-gray {
    background: #b3b3b3;
  }
  .controls-color-primary {
    background: #1890ff;
    cursor: pointer;
  }
}
.form-item-condition-item {
  margin: 10px 0;
  .condition-item-threshold-type {
    width: 120px;
  }
  .condition-item-metric {
    width: 120px;
  }
  .condition-item-condition {
    width: 120px;
  }
  .condition-item-threshold-value {
    width: 160px;
  }
  .condition-item-threshold-range {
    width: 160px;
  }
  .condition-item-tooltips {
    color: #999;
  }
  .tooltips-hidden {
    visibility: hidden;
  }
  .condition-item-delete {
    margin-left: 10px;
  }
}
</style>
