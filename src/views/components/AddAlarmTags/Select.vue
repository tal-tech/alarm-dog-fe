<template>
  <div>
    <div class="members-control">
      <el-autocomplete
        v-model="tags"
        ref="suggest-input"
        :style="{ width: inputWidth }"
        :placeholder="placeholder"
        :fetch-suggestions="fetchSuggestions"
        :debounce="debounce"
        :trigger-on-focus="false"
        :highlight-first-item="true"
        clearable
        popper-class="add-tags-select-suggest-list"
        autocomplete="new-password"
        @select="handleSelect"
      >
        <template slot-scope="{ item }">
          <div class="suggest-slot-title">
            {{ item.name }}
            <span class="suggest-slot-title-right">
              标签创建人：<user :creator="item.creator" />
            </span>
          </div>
          <div class="suggest-slot-remark" v-if="item.remark">备注：{{ item.remark }}</div>
          <div class="suggest-slot-remark" v-else>备注：无</div>
        </template>
      </el-autocomplete>
      <slot></slot>
    </div>
    <div class="members-list">
      <slot name="before-tags"></slot>
      <select-alarm-tag
        v-for="(row, index) in value"
        :key="index"
        :tag="row"
        @close-tag="removeMember(row, index)"
      />
      <slot name="after-tags"></slot>
    </div>
  </div>
</template>

<script>
import { tagSearch } from '@/api/alarmtag'
import SelectAlarmTag from './SelectAlarmTag'
import { formatInArrayNumber } from '@/utils/helpers'
import User from '@/views/components/User'

// 默认搜索用户方法
const suggestQuerySearch = (queryString, cb) => {
  tagSearch(queryString, 20).then(res => {
    cb(formatInArrayNumber(res.data.task_tags, ['id']))
  })
}

export default {
  name: 'AddTagsSelect',
  components: {
    SelectAlarmTag, User
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
      default: '请输入标签名或拼音搜索'
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
      tags: ''
    }
  },
  methods: {
    handleSelect (item) {
      if (this.value.map(i => i.id).indexOf(item.id) === -1) {
        this.value.push(item)
      }
      this.tags = ''
      this.$refs['suggest-input'].focus()
    },
    removeMember (tags, index) {
      this.value.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
.add-member-select-suggest-list .el-autocomplete-suggestion__list li {
  line-height: 24px !important;
  padding: 7px 20px !important;
}

.add-member-select-suggest-list .el-autocomplete-suggestion__list li:hover,
.add-member-select-suggest-list
  .el-autocomplete-suggestion__list
  li.highlighted {
  background-color: rgb(217, 236, 255);
}
</style>

<style lang="scss" scoped>
.suggest-slot-title {
  text-overflow: ellipsis;
  overflow: hidden;
  .suggest-slot-title-right {
    float: right;
    width: 250;
  }
}

.suggest-slot-remark {
  font-size: 12px;
  color: #aaa;
}

.members-list {
  margin-top: 10px;
}
</style>
