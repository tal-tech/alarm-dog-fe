<template>
  <el-date-picker
    :value="value"
    @input="$emit('input', $event)"
    type="datetimerange"
    range-separator="至"
    value-format="timestamp"
    :picker-options="pickerOptions"
    :clearable="clearable"
    popper-class="timerange-date"
    start-placeholder="开始日期"
    end-placeholder="结束日期">
  </el-date-picker>
</template>

<script>
export default {
  name: 'DatePicker',
  model: {
    prop: 'value'
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    disabledDate: {
      type: Function,
      default: date => date > Date.now()
    },
    shortcuts: {
      type: Function,
      default: () => []
    },
    clearable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      pickerOptions: {}
    }
  },
  created () {
    this.pickerOptions = {
      disabledDate: this.disabledDate
    }
    const shortcuts = this.shortcuts(this)
    if (shortcuts && shortcuts.length > 0) {
      this.$set(this.pickerOptions, 'shortcuts', shortcuts)
    }
  },
  methods: {
    shortcut (text, start, end) {
      return {
        text,
        onClick (picker) {
          picker.$emit('pick', [start, end])
        }
      }
    },
    shortcutLast (text, lastSecs) {
      return {
        text,
        onClick (picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - lastSecs * 1000)
          picker.$emit('pick', [start, end])
        }
      }
    },
    setShortcuts () {
      const todayTs = new Date(new Date().toLocaleDateString()).getTime()
      const shortcuts = [
        this.shortcutLast('最近10分钟', 10 * 60),
        this.shortcutLast('最近20分钟', 20 * 60),
        this.shortcutLast('最近30分钟', 30 * 60),
        this.shortcutLast('最近1小时', 60 * 60),
        this.shortcutLast('最近2小时', 2 * 60 * 60),
        this.shortcutLast('最近3小时', 3 * 60 * 60),
        this.shortcutLast('最近5小时', 3 * 60 * 60),
        this.shortcutLast('最近10小时', 10 * 60 * 60),
        this.shortcutLast('最近12小时', 12 * 60 * 60),
        this.shortcut('今天', todayTs, new Date()),
        this.shortcut('昨天', todayTs - 86400 * 1000, todayTs - 1),
        this.shortcut('前天', todayTs - 2 * 86400 * 1000, todayTs - 86400 * 1000 - 1)
      ]

      this.$set(this.pickerOptions, 'shortcuts', shortcuts)
    }
  }
}
</script>
<style lang="scss">
.timerange-date .el-picker-panel__link-btn.el-button--text {
  display: none;
}
</style>
