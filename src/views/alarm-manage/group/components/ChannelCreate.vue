<template>
  <div>
    <el-form-item
      v-for="(title, channel) in CHANNELS_USER"
      :key="channel"
      :label="title"
      :prop="channel">
      <template v-if="channel === CHANNEL_DINGWORKER">
        <add-members-select v-model="alarmGroup[channel]" />
      </template>
      <template v-else>
        <add-members-select v-model="alarmGroup[channel]" input-width="80%" >
          <template>
            <el-button
              type="primary"
              style="margin-left: 20px"
              @click="copyMembers(alarmGroup[CHANNEL_DINGWORKER], alarmGroup[channel])">
              同步工作通知人
            </el-button>
          </template>
        </add-members-select>
      </template>
    </el-form-item>
    <el-form-item :label="CHANNEL_YACHGROUP_TITLE" :prop="CHANNEL_YACHGROUP">
      <div class="yachgroup-control">
        <el-button type="primary" size="mini" @click="addRobot(CHANNEL_YACHGROUP)">添加机器人</el-button>
        <el-tooltip effect="dark" content="点击查看知音楼机器人配置的使用文档" placement="top">
          <a :href="`${manual}faq/how-to-config-yachgroup.html`" target="_blank" style="margin-left: 10px">
            <el-button type="text">文档说明</el-button>
          </a>
        </el-tooltip>
      </div>
      <div v-for="(groupItem, index) in alarmGroup[CHANNEL_YACHGROUP]" :key="index" class="yachgroup-item" style="margin-top: 10px">
        <el-input placeholder="请输入知音楼机器人Webhook" v-model="groupItem.webhook" style="width: 40%; margin-right: 10px" @blur="handleYachWebhookBlur(groupItem)">
          <template slot="prepend">Webhook</template>
        </el-input>
        <el-input placeholder="请输入知音楼机器人密钥" v-model="groupItem.secret" style="width: 40%; margin-right: 10px">
          <template slot="prepend">密钥</template>
        </el-input>
        <template>
          <el-tooltip effect="dark" content="点击按钮自动向机器人发送一条测试通知" placement="top">
            <el-button type="success" icon="el-icon-check" circle @click="validRobot(CHANNEL_YACHGROUP, groupItem)"></el-button>
          </el-tooltip>
          <el-button type="danger" icon="el-icon-delete" circle @click="removeRobot(CHANNEL_YACHGROUP, index)"></el-button>
        </template>
      </div>
    </el-form-item>
    <el-form-item :label="CHANNEL_DINGGROUP_TITLE" :prop="CHANNEL_DINGGROUP">
      <div class="dinggroup-control">
        <el-button type="primary" size="mini" @click="addRobot(CHANNEL_DINGGROUP)">添加机器人</el-button>
        <el-checkbox
          v-model="alarmGroup.enableDinggroupFocus"
          v-if="showDinggroupFocus"
          :disabled="alarmGroup[CHANNEL_DINGGROUP].length === 0"
          label="开启关键词关注"
          border
          size="mini"/>
        <el-tooltip effect="dark" content="点击查看钉钉机器人配置的使用文档" placement="top">
          <a :href="`${manual}faq/how-to-config-dinggroup.html`" target="_blank" style="margin-left: 10px">
            <el-button type="text">文档说明</el-button>
          </a>
        </el-tooltip>
      </div>
      <div v-for="(groupItem, index) in alarmGroup[CHANNEL_DINGGROUP]" :key="index" class="dinggroup-item" style="margin-top: 10px">
        <el-input placeholder="请输入钉钉机器人Webhook" v-model="groupItem.webhook" style="width: 40%; margin-right: 10px" @blur="handleDingWebhookBlur(groupItem)">
          <template slot="prepend">Webhook</template>
        </el-input>
        <el-input placeholder="请输入钉钉机器人安全设置中加密下面一行的密钥" v-model="groupItem.secret" style="width: 40%; margin-right: 10px">
          <template slot="prepend">密钥</template>
        </el-input>
        <template>
          <el-tooltip effect="dark" content="点击按钮自动向机器人发送一条测试通知" placement="top">
            <el-button type="success" icon="el-icon-check" circle @click="validRobot(CHANNEL_DINGGROUP, groupItem)"></el-button>
          </el-tooltip>
          <el-button type="danger" icon="el-icon-delete" circle @click="removeRobot(CHANNEL_DINGGROUP, index)"></el-button>
        </template>
      </div>
      <div v-if="showDinggroupFocus" v-show="alarmGroup.enableDinggroupFocus && alarmGroup[CHANNEL_DINGGROUP].length" class="dinggroup-focus" style="margin-top: 10px">
        <el-input placeholder="请输入关注关键词，多个以|符号分隔" v-model="alarmGroup.dinggroupfocus">
          <template slot="prepend">关键词</template>
        </el-input>
      </div>
    </el-form-item>
    <el-form-item :label="CHANNEL_WEBHOOK_TITLE" :prop="CHANNEL_WEBHOOK">
      <el-input style="width: 80.95%; margin-right: 10px" placeholder="必须以http或者https开头，不是钉钉或者知音楼机器人的WebHook" v-model="alarmGroup[CHANNEL_WEBHOOK].url" clearable></el-input>
      <el-tooltip effect="dark" content="点击按钮自动请求该地址，并验证状态码是否为200" placement="top">
        <el-button type="success" icon="el-icon-check" circle @click="validWebHook(alarmGroup[CHANNEL_WEBHOOK].url)"></el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="点击查看WebHook通知的使用文档" placement="top">
        <a :href="`${manual}faq/how-to-use-webhook.html`" target="_blank" style="margin-left: 10px">
          <el-button type="text">文档说明</el-button>
        </a>
      </el-tooltip>
    </el-form-item>
  </div>
</template>

<script>
import { validRobotParam, validWebHookAddress } from '@/api/alarmtask'
import AddMembersSelect from '@/views/components/AddMembers/Select'
import {
  CHANNELS,
  CHANNELS_USER,
  CHANNELS_ROBOT,
  CHANNEL_DINGGROUP,
  CHANNEL_DINGGROUP_TITLE,
  CHANNEL_DINGWORKER,
  CHANNEL_YACHGROUP,
  CHANNEL_YACHGROUP_TITLE,
  CHANNEL_WEBHOOK,
  CHANNEL_WEBHOOK_TITLE
} from '@/consts/alarm'

export default {
  name: 'AlarmGroupChannelCreate',
  components: { AddMembersSelect },
  model: {
    prop: 'alarmGroup'
  },
  props: {
    alarmGroup: {
      type: Object,
      required: true
    },
    showDinggroupFocus: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      CHANNELS_USER,
      CHANNEL_DINGWORKER,
      CHANNEL_DINGGROUP,
      CHANNEL_DINGGROUP_TITLE,
      CHANNEL_YACHGROUP,
      CHANNEL_YACHGROUP_TITLE,
      CHANNEL_WEBHOOK,
      CHANNEL_WEBHOOK_TITLE
    }
  },
  computed: {
    manual () {
      return this.$store.state.settings.copyright.manual
    }
  },
  methods: {
    // 添加机器人配置
    addRobot (channel) {
      this.alarmGroup[channel].push({
        webhook: '',
        secret: ''
      })
    },
    // 校验机器人参数
    validRobot (channel, groupItem) {
      this.formLoading = true
      validRobotParam(groupItem.webhook, groupItem.secret, channel)
        .then(res => {
          this.$message.success('校验成功')
        }).finally(() => {
          this.formLoading = false
        })
    },
    // 校验WebHook地址
    validWebHook (url) {
      this.formLoading = true
      validWebHookAddress(url)
        .then(res => {
          this.$message.success('校验成功')
        }).finally(() => {
          this.formLoading = false
        })
    },
    // 移除机器人配置
    removeRobot (channel, index) {
      this.alarmGroup[channel].splice(index, 1)
    },
    // 复制一个列表中数据到另外一个
    copyMembers (src, dst) {
      // 计算出目标数据源的map，用于对比去重
      const dstMap = {}
      dst.forEach(item => {
        dstMap[item.uid] = 1
      })
      src.forEach(item => {
        if (!dstMap[item.uid]) {
          dst.push(item)
        }
      })
    },
    // dinggroup webhook blur 事件
    handleDingWebhookBlur (form) {
      form.webhook = form.webhook.replace(/^https?:\/\/oapi\.dingtalk[^=]+=/, '')
    },
    // yachgroup webhook blur 事件
    handleYachWebhookBlur (form) {
      form.webhook = form.webhook.replace(/^https?:\/\/yach-oapi\.zhiyinlou[^=]+=/, '')
    },
    // 获取表单数据
    getFormData (srcChannels, withGroupFocus = false) {
      const alarmGroup = srcChannels || this.alarmGroup

      const channels = {}
      if (withGroupFocus) {
        channels['dinggroupfocus'] = alarmGroup.enableDinggroupFocus && alarmGroup[CHANNEL_DINGGROUP].length
          ? alarmGroup.dinggroupfocus : null
      }

      Object.keys(CHANNELS).forEach(channel => {
        if (CHANNELS_USER[channel] && alarmGroup[channel].length > 0) {
          channels[channel] = alarmGroup[channel].map(item => item.uid)
        } else if (CHANNELS_ROBOT[channel] && alarmGroup[channel].length > 0) {
          channels[channel] = alarmGroup[channel]
        } else if (channel == CHANNEL_WEBHOOK && alarmGroup[channel].url) {
          channels[channel] = {
            url: alarmGroup[channel].url
          }
        }
      })

      return channels
    }
  }
}
</script>
