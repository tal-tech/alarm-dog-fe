<template>
  <el-form :model="postForm" class="form-container" label-width="120px" ref="form">
    <el-form-item label="状态" prop="enable">
      <el-switch
        v-model="postForm.enable"
        active-color="#13ce66"
        inactive-color="#ff4949">
      </el-switch>

      <el-tooltip effect="dark" content="点击查看告警收敛的使用文档" placement="top">
        <a :href="`${manual}advance-function/compress.html`" target="_blank" style="margin-left: 10px">
          <el-button type="text">文档说明</el-button>
        </a>
      </el-tooltip>
    </el-form-item>

    <div v-show="postForm.enable">
      <el-form-item label="收敛方式" prop="method">
        <div class="compress-method-options">
          <el-radio-group v-model="postForm.method">
            <el-radio v-for="(title, method) in compressMethods" :key="method" :label="Number(method)">
              {{ title }}
            </el-radio>
          </el-radio-group>
        </div>
        <div v-show="postForm.method === COMPRESS_METHOD_CONDITION">
          <el-alert
            type="info"
            :closable="false"
            show-icon
            style="margin-bottom: 10px" >
            <template #title>
              配置一系列条件组成逻辑运算单元，断言是否满足收敛条件，详细文档请参考：
              <el-link type="primary" :href="`${manual}advance-function/compress.html#收敛方式-条件收敛`" target="_blank">
                收敛方式-条件收敛
              </el-link>
            </template>
          </el-alert>
          <condition-rule
            :conditions="postForm.conditions"
            :operators="operators" />
        </div>
        <div v-show="postForm.method === COMPRESS_METHOD_CONTENT">
          <el-alert
            type="info"
            :closable="false"
            show-icon >
            <template #title>
              将相同的告警内容content进行收敛，详细文档请参考：
              <el-link type="primary" :href="`${manual}advance-function/compress.html#收敛方式-内容收敛`" target="_blank">
                收敛方式-内容收敛
              </el-link>
            </template>
          </el-alert>
        </div>
        <div v-show="postForm.method === COMPRESS_METHOD_FULL">
          <el-alert
            type="warning"
            :closable="false"
            show-icon >
            <template #title>
              该告警任务内的任何告警都会被收敛，详细文档请参考：
              <el-link type="primary" :href="`${manual}advance-function/compress.html#收敛方式-全量收敛`" target="_blank">
                收敛方式-全量收敛
              </el-link>
            </template>
          </el-alert>
        </div>
      </el-form-item>

      <el-form-item label="收敛策略" prop="strategy">
        <div class="compress-strategy-options">
          <el-radio-group v-model="postForm.strategy">
            <el-radio :label="1">周期收敛</el-radio>
            <el-radio :label="2">延迟收敛</el-radio>
            <el-radio :label="3">周期次数收敛</el-radio>
            <el-radio :label="4">次数周期收敛</el-radio>
            <el-radio :label="5">次数收敛</el-radio>
          </el-radio-group>
        </div>
        <div class="strategy-period" v-show="postForm.strategy == 1">
          <el-input-number v-model="postForm.strategy_cycle" :min="1" size="mini" style="width: 100px" />
          分钟后开始下一轮收敛周期，详细文档请参考：
          <el-link type="primary" :href="`${manual}advance-function/compress.html#收敛策略-周期收敛`" target="_blank" :underline="false">
            收敛策略-周期收敛
          </el-link>
        </div>
        <div class="strategy-delay" v-show="postForm.strategy == 2">
          延迟
          <el-input-number v-model="postForm.strategy_cycle" :min="1" size="mini" style="width: 100px" />
          分钟后发送告警统计报告，详细文档请参考：
          <el-link type="primary" :href="`${manual}advance-function/compress.html#收敛策略-延迟收敛`" target="_blank" :underline="false">
            收敛策略-延迟收敛
          </el-link>
        </div>
        <div class="strategy-period-times" v-show="postForm.strategy == 3">
          <el-input-number v-model="postForm.strategy_cycle" :min="1" size="mini" style="width: 100px" />
          分钟内告警达到
          <el-input-number v-model="postForm.strategy_count" :min="1" size="mini" style="width: 100px" />
          条之后开始下一轮周期，详细文档请参考：
          <el-link type="primary" :href="`${manual}advance-function/compress.html#收敛策略-周期次数收敛`" target="_blank" :underline="false">
            收敛策略-周期次数收敛
          </el-link>
        </div>
        <div class="strategy-times-period" v-show="postForm.strategy == 4">
          <el-input-number v-model="postForm.strategy_cycle" :min="1" size="mini" style="width: 100px" />
          分钟内告警达到
          <el-input-number v-model="postForm.strategy_count" :min="1" size="mini" style="width: 100px" />
          条之后才发送告警，并开始下一轮周期，详细文档请参考：
          <el-link type="primary" :href="`${manual}advance-function/compress.html#收敛策略-次数周期收敛`" target="_blank" :underline="false">
            收敛策略-次数周期收敛
          </el-link>
          <el-tag type="warning" size="small">不安全收敛策略</el-tag>
        </div>
        <div class="strategy-times" v-show="postForm.strategy == 5">
          <el-input-number v-model="postForm.strategy_cycle" :min="1" size="mini" style="width: 100px" />
          分钟内告警达到
          <el-input-number v-model="postForm.strategy_count" :min="1" size="mini" style="width: 100px" />
          条之后才发送告警，并不重置周期，详细文档请参考：
          <el-link type="primary" :href="`${manual}advance-function/compress.html#收敛策略-次数收敛`" target="_blank" :underline="false">
            收敛策略-次数收敛
          </el-link>
          <el-tag type="danger" size="small">极其不安全收敛策略</el-tag>
        </div>
      </el-form-item>

      <el-form-item label="未命中收敛" prop="not_match">
        <el-radio-group v-model="postForm.not_match">
          <el-radio :label="1">直接发送</el-radio>
          <el-radio :label="0">丢弃告警</el-radio>
        </el-radio-group>
      </el-form-item>
    </div>

    <el-form-item>
      <el-button type="primary" @click="$emit('change-active', 'upgrade')">下一步</el-button>
      <el-button type="primary" @click="$emit('change-active', 'filter')">上一步</el-button>
      <el-button type="success" @click="$emit('submmit-form')">保存</el-button>
      <el-button @click="$emit('go-back')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { formatNumber } from '@/utils/helpers'
import ConditionRule from './ConditionRule'
import {
  operators,
  COMPRESS_METHOD_CONDITION,
  COMPRESS_METHOD_SIMHASH,
  COMPRESS_METHOD_CONTENT,
  COMPRESS_METHOD_FULL,
  compressMethods
} from '@/consts/alarm'

export default {
  name: 'CreateCompress',
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
      operators: operators,
      COMPRESS_METHOD_CONDITION,
      COMPRESS_METHOD_SIMHASH,
      COMPRESS_METHOD_CONTENT,
      COMPRESS_METHOD_FULL,
      compressMethods
    }
  },
  computed: {
    manual () {
      return this.$store.state.settings.copyright.manual
    }
  },
  methods: {
    // 格式化compress表单
    getFormData () {
      const compress = {
        enable: this.postForm.enable,
        method: this.postForm.method,
        strategy: this.postForm.strategy,
        strategy_cycle: this.postForm.strategy_cycle,
        strategy_count: this.postForm.strategy_count,
        not_match: this.postForm.not_match,
        conditions: this.postForm.conditions
      }
      return compress
    },
    // 初始化告警收敛数据
    initForm (task) {
      const enable = task.compress ? !!task.compress.enable : false
      const compress = {
        enable: enable,
        method: enable ? formatNumber(task.compress.method, 1) : 1,
        conditions: enable ? task.compress.conditions || [] : [],
        strategy: enable ? formatNumber(task.compress.strategy, 1) : 1,
        strategy_cycle: enable ? formatNumber(task.compress.strategy_cycle, 0) : 0,
        strategy_count: enable ? formatNumber(task.compress.strategy_count, 0) : 0,
        not_match: enable ? formatNumber(task.compress.not_match, 1) : 1
      }
      return compress
    }
  }
}
</script>

<style lang="scss">

</style>
