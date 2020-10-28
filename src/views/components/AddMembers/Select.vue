<template>
  <div>
    <div class="members-control">
      <el-autocomplete
        v-model="member"
        ref="suggest-input"
        :style="{ width: inputWidth }"
        :placeholder="placeholder"
        :fetch-suggestions="fetchSuggestions"
        :debounce="debounce"
        :trigger-on-focus="false"
        :highlight-first-item="true"
        clearable
        popper-class="add-member-select-suggest-list"
        autocomplete="new-password"
        @select="handleSelect"
      >
        <template slot-scope="{ item }">
          <div class="suggest-slot-title">
            {{ item.username }}（{{ item.email | removeEmailSuffix }}）
            <span class="suggest-slot-title-right">工号: {{ item.uid }}</span>
          </div>
          <div class="suggest-slot-remark">{{ item.department }}</div>
        </template>
      </el-autocomplete>
      <slot></slot>
    </div>
    <div class="members-list">
      <slot name="before-tags"></slot>
      <select-member-tag
        v-for="(row, index) in value"
        :key="index"
        :member="row"
        @close-tag="removeMember(row, index)"
      />
      <slot name="after-tags"></slot>
    </div>
  </div>
</template>

<script>
import { userSearch } from '@/api/user'
import { removeEmailSuffix } from '@/utils/filters'
import SelectMemberTag from './SelectMemberTag'
import { formatInArrayNumber } from '@/utils/helpers'

// 默认搜索用户方法
const suggestQuerySearch = (queryString, cb) => {
  userSearch(queryString, 20)
    .then(res => {
      cb(formatInArrayNumber(res.data.users, ['uid']))
    })
}

export default {
  name: 'AddMembersSelect',
  components: {
    SelectMemberTag
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
      default: '请输入姓名或拼音搜索，若搜索不到请输入工号刷新缓存'
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
      member: ''
    }
  },
  filters: {
    removeEmailSuffix
  },
  methods: {
    handleSelect (item) {
      if (this.value.map(i => i.uid).indexOf(item.uid) === -1) {
        this.value.push(item)
      }
      this.member = ''
      this.$refs['suggest-input'].focus()
    },
    removeMember (member, index) {
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
  .add-member-select-suggest-list .el-autocomplete-suggestion__list li.highlighted {
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

  .members-list {
    margin-top: 10px;
  }
</style>
