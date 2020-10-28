<template>
  <el-autocomplete
    class="inline-input"
    :value="field"
    @input="$emit('input', $event)"
    :size="size"
    :fetch-suggestions="fetchFields"
    :placeholder="placeholder" >
    <template slot-scope="{ item }">
      {{ item.value }}
      <code class="highlight" v-if="item.unit">
        {{ timeMap[item.unit] }}:
        {{ item.label }}
      </code>
      <code class="highlight" v-else>
        {{ dsMap[item.type] }}:
        {{ item.label }}
      </code>
    </template>
  </el-autocomplete>
</template>

<script>
import {
  DS_FIELD_TYPE_FLOAT,
  DS_FIELD_TYPE_INTEGER,
  DS_TIMESTAMP_UNIT_SECOND,
  DS_TIMESTAMP_UNIT_MS,
  DS_TIMESTAMP_UNIT_US,
  DS_TIMESTAMP_UNIT_ISOSTR
} from '@/consts/monitor'

export default {
  name: 'Autocomplete',
  model: {
    prop: 'field'
  },
  props: {
    field: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: '指标名称'
    },
    size: {
      type: String,
      default: 'small'
    },
    fields: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      dsMap: {
        [DS_FIELD_TYPE_FLOAT]: 'F',
        [DS_FIELD_TYPE_INTEGER]: 'INT'
      },
      timeMap: {
        [DS_TIMESTAMP_UNIT_SECOND]: 'sec',
        [DS_TIMESTAMP_UNIT_MS]: 'ms',
        [DS_TIMESTAMP_UNIT_US]: 'μs',
        [DS_TIMESTAMP_UNIT_ISOSTR]: 'iso'
      }
    }
  },
  methods: {
    // 获取告警条件字段
    fetchFields (queryString, cb) {
      const list = JSON.parse(JSON.stringify(this.fields))
      cb(list)
    }
  }
}
</script>
