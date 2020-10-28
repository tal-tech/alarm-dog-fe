<template>
  <el-cascader
    ref="cascader"
    :value="model"
    @input="$emit('input', $event)"
    :placeholder="placeholder"
    :props="props"
    :options="options"
    clearable
    filterable
    :filter-method="handleFilter"
    :before-filter="beforeFilter"
    @focus="handleFocus" />
</template>

<script>
import { simpleDepartments } from '@/api/department'
import { simpleTasks } from '@/api/alarmtask'
import { formatInArrayNumber } from '@/utils/helpers'

export default {
  name: 'CascaderTask',
  model: {
    prop: 'model'
  },
  props: {
    model: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      default: '部门 / 告警任务筛选'
    }
  },
  data () {
    return {
      options: [],
      props: {
        lazy: true,
        lazyLoad (node, resolve) {
          // 根目录或者已初始化则跳过
          if (node.level == 0 || node.loaded) {
            return resolve(node)
          }
          simpleTasks(null, null, node.value)
            .then(res => {
              const children = res.data.tasks.map(item => {
                return {
                  value: item.id,
                  label: item.name,
                  pinyin: item.pinyin,
                  leaf: true
                }
              })
              children.unshift({
                value: null,
                label: '全部',
                pinyin: 'quanbu',
                leaf: true
              })
              node.children = []
              resolve(children)
            }).catch(() => {
              resolve([])
            })
        }
      },
      searchTaskId: null
    }
  },
  computed: {
    buId () {
      return this.$store.state.app.buId
    }
  },
  watch: {
    buId () {
      this.getDepartments()
    }
  },
  created () {
    this.getDepartments()
  },
  mounted () {
    if (this.$route.query.taskid) {
      this.searchTaskId = String(this.$route.query.taskid)
      this.$refs.cascader.inputValue = this.searchTaskId
      this.$refs.cascader.filterHandler()
    }
  },
  methods: {
    // 用于筛选的部门列表
    getDepartments () {
      simpleDepartments(null, null, this.buId)
        .then(res => {
          this.options = formatInArrayNumber(res.data.departments, ['id']).map(item => {
            return {
              value: item.id,
              label: item.name,
              children: []
            }
          })
        })
    },
    // 级联选择器搜索
    handleFilter (node, keyword) {
      if (this.model[0]) {
        if (node.parent && node.parent.level === 1 && node.parent.value != this.model[0]) {
          return false
        }
        if (node.level === 1 && node.value != this.model[0]) {
          return false
        }
      }
      return node.label.toLowerCase().indexOf(keyword.toLowerCase()) > -1 ||
        node.value == keyword ||
        (node.pinyin && node.pinyin.indexOf(keyword.toLowerCase()) > -1)
    },
    // 级联选择器前置搜索拦截，用于进行统一搜索
    async beforeFilter (keyword) {
      await simpleTasks(keyword, 20, this.model[0] || null)
        .then(res => {
          const keyedTasks = {}
          this.options.forEach(option => {
            option.children.forEach(task => {
              keyedTasks[task.value] = true
            })
          })

          res.data.tasks.forEach(item => {
            if (!keyedTasks[item.id]) {
              for (let i = 0; i < this.options.length; i++) {
                if (this.options[i].value == item.department_id) {
                  this.options[i].children.push({
                    value: item.id,
                    label: item.name,
                    pinyin: item.pinyin,
                    leaf: true
                  })
                  break
                }
              }
            }

            if (this.searchTaskId && this.searchTaskId == item.id) {
              this.$emit('setModel', [item.department_id, item.id])
            }
          })
        })
      return true
    },
    // focus事件
    handleFocus () {
      this.$refs.cascader.getCheckedNodes().forEach(node => {
        this.$refs.cascader.panel.lazyLoad(node.parent)
      })
    }
  }
}
</script>
