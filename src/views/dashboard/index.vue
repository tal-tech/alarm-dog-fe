<template>
  <div class="dashboard-container">
    <div class="full-box clearfix">
      <el-cascader
        v-model="cascaderModel"
        :props="cascaderProps"
        clearable
        style="width: 360px" />

      <el-date-picker
        v-model="date"
        type="date"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions" />

      <el-button type="primary" @click="handleFilter" style="margin-left: 10px">筛选</el-button>
    </div>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="6" >
        <chart-card class="full-box" title="今日累计告警">
          <template slot="action">
            <el-tooltip class="item" effect="dark" content="今日累计告警数量" placement="top">
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </template>
          <template slot="footer">
            <trend :flag="stat.history_count.trend.lastweek.float" style="margin-right: 16px;">
              <span slot="term">周同比</span>
              {{ stat.history_count.trend.lastweek.percent }}
            </trend>
            <trend :flag="stat.history_count.trend.yesterday.float">
              <span slot="term">日同比</span>
              {{ stat.history_count.trend.yesterday.percent }}
            </trend>
          </template>
          <div class="chart-card__content-total">
            {{ stat.history_count.today }}
          </div>
        </chart-card>
      </el-col>
      <el-col :span="6" >
        <chart-card class="full-box" title="任务总数">
          <template slot="action">
            <el-tooltip class="item" effect="dark" content="平台至今创建的任务数" placement="top">
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </template>
          <template slot="footer">
            <trend :flag="stat.task_count.trend.lastweek.float" style="margin-right: 16px;">
              <span slot="term">周同比</span>
              {{ stat.task_count.trend.lastweek.percent }}
            </trend>
            <trend :flag="stat.task_count.trend.yesterday.float">
              <span slot="term">日同比</span>
              {{ stat.task_count.trend.yesterday.percent }}
            </trend>
          </template>
          <div class="chart-card__content-total">
            {{ stat.task_count.today }}
          </div>
        </chart-card>
      </el-col>
      <el-col :span="6" >
        <chart-card class="full-box" title="今日活跃任务">
          <template slot="action">
            <el-tooltip class="item" effect="dark" content="今日有收到告警的任务数量" placement="top">
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </template>
          <template slot="footer">
            <trend :flag="stat.active_task_count.trend.lastweek.float" style="margin-right: 16px;">
              <span slot="term">周同比</span>
              {{ stat.active_task_count.trend.lastweek.percent }}
            </trend>
            <trend :flag="stat.active_task_count.trend.yesterday.float">
              <span slot="term">日同比</span>
              {{ stat.active_task_count.trend.yesterday.percent }}
            </trend>
          </template>
          <div class="chart-card__content-total">
            {{ stat.active_task_count.today }}
          </div>
        </chart-card>
      </el-col>
      <el-col :span="6" >
        <chart-card class="full-box chart-card-workflow" title="今日工作流">
          <template slot="action">
            <el-tooltip class="item" effect="dark" content="今日产生的工作流统计，完成为处理完成和关闭的和" placement="top">
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </template>
          <template slot="footer">
            新增<span class="separator">/</span>认领<span class="separator">/</span>完成
          </template>
          <div class="chart-card__content-total">
            {{ stat.workflow_count.pending }}<span class="separator">/</span>{{ stat.workflow_count.claim }}<span class="separator">/</span>{{ stat.workflow_count.finish }}
          </div>
        </chart-card>
      </el-col>
    </el-row>

    <div class="chart-lines">
      <el-card v-for="(setting, group) in chartLines" :key="group" class="chart-lines-card" :header="setting.title">
        <el-row :gutter="50">
          <el-col :span="17" >
            <ve-line :data="{ columns: ['created_at', 'value'], rows: setting.points }" :settings="chartSettings" />
          </el-col>
          <el-col :span="7" class="chart-lines-top10">
            <div class="title">
              {{ setting.title }} Top10
            </div>
            <ul class="list">
              <li v-for="(top10Item, top10Idx) in setting.top10" :key="top10Item.task_id">
                <span class="rank" :class="{ active: top10Idx < 3 }">{{ top10Idx + 1 }}</span>
                <router-link :to="{ name: 'AlarmTaskShow', params: { taskId: top10Item.task_id }}" class="link">
                  <span class="title">{{ top10Item.name }}</span>
                </router-link>
                <span class="value">{{ top10Item.value }}</span>
              </li>
            </ul>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  simpleAllTasks,
  simpleByTag
} from '@/api/alarmtask'
import {
  simpleDepartments
} from '@/api/department'
import {
  tagSearch
} from '@/api/alarmtag'
import {
  stat,
  avgReqQps,
  maxReqQps,
  avgProdQps,
  maxProdQps
} from '@/api/dashboard'
import { formatInArrayNumber, formatNumber } from '@/utils/helpers'
import { percentage, formatNumber as formatNumberFilter, formatDate } from '@/utils/filters'
import store from '@/store'
import Trend from '@/views/components/Trend'
import ChartCard from '@/views/components/ChartCard'
import VeLine from 'v-charts/lib/line.common'

// 三级联动菜单的一级ID
const VIRTUAL_CASCADER_DEP_ID = 0
const VIRTUAL_CASCADER_TAG_ID = 1

const defaultStat = {
  today: null,
  trend: {
    yesterday: {
      float: 'up',
      percent: '0'
    },
    lastweek: {
      float: 'up',
      percent: '0'
    }
  }
}

export default {
  name: 'Dashboard',
  components: { Trend, ChartCard, VeLine },
  data () {
    return {
      cascaderModel: [VIRTUAL_CASCADER_DEP_ID],
      cascaderProps: {
        checkStrictly: true,
        lazy: true,
        lazyLoad (node, resolve) {
          // 仅加载3级数据
          if (node.loaded || node.level > 2) {
            return resolve(node)
          }

          switch (node.level) {
            case 0:
              // 第一级，部门/标签
              const nodes = [
                { value: VIRTUAL_CASCADER_DEP_ID, label: '部门', leaf: false },
                { value: VIRTUAL_CASCADER_TAG_ID, label: '标签', leaf: false }
              ]
              return resolve(nodes)
            case 1:
              // 第二级，部门列表/标签列表
              if (node.value == VIRTUAL_CASCADER_DEP_ID) {
                simpleDepartments(null, null, store.state.app.buId)
                  .then(res => {
                    const nodes = formatInArrayNumber(res.data.departments, ['id']).map(item => {
                      return { value: item.id, label: item.name, leaf: false }
                    })
                    resolve(nodes)
                  })
              } else {
                tagSearch(null, null)
                  .then(res => {
                    const nodes = formatInArrayNumber(res.data.task_tags, ['id']).map(item => {
                      return { value: item.id, label: item.name, leaf: false }
                    })
                    resolve(nodes)
                  })
              }
              return
            case 2:
              // 第三级，任务列表
              if (node.pathNodes[0].value == VIRTUAL_CASCADER_DEP_ID) {
                simpleAllTasks(null, null, node.value)
                  .then(res => {
                    const nodes = formatInArrayNumber(res.data.tasks, ['id']).map(item => {
                      return { value: item.id, label: item.name, leaf: true }
                    })
                    resolve(nodes)
                  })
              } else {
                simpleByTag(node.value)
                  .then(res => {
                    const nodes = formatInArrayNumber(res.data.tasks, ['id']).map(item => {
                      return { value: item.id, label: item.name, leaf: true }
                    })
                    resolve(nodes)
                  })
              }
          }
        }
      },
      date: null,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // 告警总览
      stat: {
        history_count: JSON.parse(JSON.stringify(defaultStat)),
        task_count: JSON.parse(JSON.stringify(defaultStat)),
        active_task_count: JSON.parse(JSON.stringify(defaultStat)),
        workflow_count: {
          pending: '-',
          claim: '-',
          finish: '-' // finish=finish+close
        }
      },
      // 曲线图
      chartLines: {
        avgReqQps: {
          title: '平均请求QPS',
          points: [],
          top10: []
        },
        maxReqQps: {
          title: '最大请求QPS',
          points: [],
          top10: []
        },
        avgProdQps: {
          title: '平均生产QPS',
          points: [],
          top10: []
        },
        maxProdQps: {
          title: '最大生产QPS',
          points: [],
          top10: []
        }
      },
      // 曲线图配置
      chartSettings: {
        metrics: ['value'],
        dimension: ['time'],
        labelMap: {
          'time': '时间',
          'value': 'qps'
        }
      }
    }
  },
  computed: {
    buId () {
      return this.$store.state.app.buId
    },
    depId () {
      return this.cascaderModel[0] == VIRTUAL_CASCADER_DEP_ID ? (this.cascaderModel[1] || null) : null
    },
    tagId () {
      return this.cascaderModel[0] == VIRTUAL_CASCADER_TAG_ID ? (this.cascaderModel[1] || null) : null
    },
    taskId () {
      return this.cascaderModel[2] || null
    }
  },
  created () {
    this.handleFilter()
  },
  methods: {
    handleFilter () {
      this.getStat()
      this.getChartLines()
    },
    getStat () {
      stat(this.depId, this.tagId, this.taskId, this.date)
        .then(res => {
          const workflowPending = formatNumber(res.data.workflow_count.pending, null)
          const workflowClaim = formatNumber(res.data.workflow_count.claim, null)
          const workflowFinish = this.numberSum(res.data.workflow_count.finish, res.data.workflow_count.close)
          this.stat = {
            history_count: this.computingStat(res.data.history_count || {}),
            task_count: this.computingStat(res.data.task_count || {}),
            active_task_count: this.computingStat(res.data.active_task_count || {}),
            workflow_count: {
              pending: workflowPending === null ? '-' : formatNumberFilter(workflowPending),
              claim: workflowClaim === null ? '-' : formatNumberFilter(workflowClaim),
              finish: workflowFinish === null ? '-' : workflowFinish
            }
          }
        })
    },
    getChartLines () {
      const groups = { avgReqQps, maxReqQps, avgProdQps, maxProdQps }
      for (const group in groups) {
        groups[group](this.depId, this.tagId, this.taskId, this.date)
          .then(res => {
            this.chartLines[group].points = this.formatPoints(res.data.points)
            this.chartLines[group].top10 = this.formatTop10(res.data.top10)
          })
      }
    },
    computingStat (count) {
      const today = formatNumber(count.today, null)
      const yesterday = formatNumber(count.yesterday, 0)
      const lastweek = formatNumber(count.lastweek, 0)

      return {
        today: today === null ? '-' : formatNumberFilter(today),
        trend: {
          yesterday: this.computingStatTrend(today, yesterday),
          lastweek: this.computingStatTrend(today, lastweek)
        }
      }
    },
    computingStatTrend (today, anotherDay) {
      if (!today && anotherDay) {
        return {
          float: 'down',
          percent: '100%'
        }
      } else if (today && !anotherDay) {
        return {
          float: 'up',
          percent: '100%'
        }
      } else if (!today && !anotherDay) {
        return {
          float: 'up',
          percent: '0'
        }
      } else {
        return {
          float: today > anotherDay ? 'up' : 'down',
          percent: percentage(Math.abs(today - anotherDay) / anotherDay, 0)
        }
      }
    },
    // 数字求和
    numberSum () {
      let sum = 0
      let hasNumber = false
      let numFormatted = null

      for (const num of arguments) {
        numFormatted = formatNumber(num, null)
        if (numFormatted !== null) {
          sum += numFormatted
          hasNumber = true
        }
      }

      return hasNumber ? formatNumberFilter(sum) : null
    },
    // 曲线图point格式化
    formatPoints (points) {
      if (typeof points !== 'object' && points.constructor !== Array) {
        return []
      }

      const formatted = []
      formatInArrayNumber(points, ['created_at', 'value']).sort((a, b) => a.created_at - b.created_at).forEach(point => {
        formatted.push({
          time: formatDate(point.created_at, 'hh:mm'),
          value: formatNumber(point.value, 0)
        })
      })

      return formatted
    },
    // 曲线图top10格式化
    formatTop10 (top10) {
      if (typeof top10 !== 'object' && top10.constructor !== Array) {
        return []
      }

      // 强制格式化、排序，避免后端返回数据有问题
      return formatInArrayNumber(top10, ['task_id', 'value']).sort((a, b) => b.value - a.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.full-box {
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}
.chart-card__content-total {
  line-height: 38px;
  height: 38px;
  color: #000;
  font-size: 30px;
}
.chart-card-workflow {
  font-size: 14px;
  line-height: 22px;
  .chart-card__content-total {
    font-size: 24px;
  }
  .separator {
    margin: 0 9px;
    font-weight: 700;
    color: #c0c4cc;
  }
}
.chart-lines-card {
  margin-top: 20px;
}
.chart-lines-top10 {
  .title {
    font-weight: 500;
    font-size: 15px;
    color: rgba(0,0,0,.85);
  }
  .list {
    list-style: none;
    margin: 30px 0 0 0;
    padding: 0;
    li {
      position: relative;
      margin: 12px 0;
      padding: 0 60px 0 40px;
      font-size: 14px;
      line-height: 22px;
      color: rgba(0,0,0,.65);
      .title {
        color: #409EFF;
      }
      .rank {
        position: absolute;
        left: 0;
        width: 22px;
        height: 22px;
        line-height: 22px;
        border-radius: 22px;
        display: inline-block;
        background: #f5f5f5;
        text-align: center;
        &.active {
          background: #314659;
          color: #fff;
        }
      }
      .value {
        position: absolute;
        right: 0;
        top: 4px;
      }
    }
  }
}
</style>
