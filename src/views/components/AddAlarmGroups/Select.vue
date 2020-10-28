<template>
  <div>
    <div class="groups-control">
      <el-autocomplete
        v-model="group"
        ref="suggest-input"
        :style="{ width: inputWidth }"
        :placeholder="placeholder"
        :fetch-suggestions="fetchSuggestions"
        :debounce="debounce"
        :trigger-on-focus="false"
        :highlight-first-item="true"
        clearable
        popper-class="add-group-select-suggest-list"
        autocomplete="new-password"
        @select="handleSelect"
      >
        <template slot-scope="{ item }">
          <div class="suggest-slot-title">
            {{ item.name }}
            <span class="suggest-slot-title-right">ID: {{ item.id }}</span>
          </div>
          <div class="suggest-slot-remark">备注：{{ item.remark }}</div>
        </template>
      </el-autocomplete>
      <slot></slot>
    </div>
    <div class="groups-list">
      <slot name="before-tags"></slot>
      <div v-show="value.length === 0">
        还没有告警通知组？点我
        <router-link :to="{ name: 'AlarmGroupCreate'}" target="_blank">
          <el-button type="text">创建</el-button>
        </router-link>
      </div>

      <add-alarm-groups-tag
        v-for="(row, index) in value"
        :key="index"
        :group="row"
        @close-tag="removeGroup(row, index)"
      />
      <slot name="after-tags"></slot>
    </div>
  </div>
</template>

<script>
import { groupSearch, showGroup } from '@/api/alarmgroup'
import AddAlarmGroupsTag from './Tag'
import { formatInArrayNumber, formatInObjectNumber } from '@/utils/helpers'

// 默认搜索用户方法
const suggestQuerySearch = (queryString, cb) => {
  groupSearch(queryString, 20)
    .then(res => {
      cb(formatInArrayNumber(res.data.alarmgroups, ['id', 'created_at']))
    })
}

export default {
  name: 'AddAlarmGroupsSelect',
  components: {
    AddAlarmGroupsTag
  },
  model: {
    prop: 'value'
  },
  props: {
    value: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      default: '请输入告警通知组名称搜索'
    },
    inputWidth: {
      type: String,
      default: '100%'
    },
    fetchSuggestions: {
      type: Function,
      default: suggestQuerySearch
    },
    debounce: {
      type: Number,
      default: 300
    }
  },
  data () {
    return {
      group: '',
      cacheGroups: {}
    }
  },
  methods: {
    handleSelect (item) {
      if (this.value.map(i => i.id).indexOf(item.id) === -1) {
        this.value.push(item)
      }
      this.group = ''
      this.$refs['suggest-input'].focus()
      // this.fillMoreInfo()
    },
    removeGroup (group, index) {
      this.value.splice(index, 1)
    },
    // 填充更多信息
    fillMoreInfo () {
      this.value.forEach((row, index) => {
        if (!this.cacheGroups[row.id]) {
          showGroup(row.id)
            .then(res => {
              const alarmGroup = formatInObjectNumber(res.data.alarmgroup, ['id', 'created_at'])
              this.$set(this.value, index, JSON.parse(JSON.stringify(alarmGroup)))
              this.$set(this.cacheGroups, row.id, JSON.parse(JSON.stringify(alarmGroup)))
            })
        } else {
          this.$set(this.value, index, this.cacheGroups[row.id])
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .add-group-select-suggest-list .el-autocomplete-suggestion__list li {
    line-height: 24px !important;
    padding: 7px 20px !important;
  }

  .add-group-select-suggest-list .el-autocomplete-suggestion__list li:hover,
  .add-group-select-suggest-list .el-autocomplete-suggestion__list li.highlighted {
    background-color: rgb(217, 236, 255);
  }
</style>

<style lang="scss" scoped>
  .suggest-slot-title {
    text-overflow: ellipsis;
    overflow: hidden;
    .suggest-slot-title-right {
      float: right;
      width: 11ch;
    }
  }

  .suggest-slot-remark {
    font-size: 12px;
    color: #aaa;
  }

  .groups-list {
    margin-top: 10px;
  }
</style>
