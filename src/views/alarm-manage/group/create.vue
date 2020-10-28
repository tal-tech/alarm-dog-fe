<template>
  <div class="app-container">
    <el-form :model="postForm" class="form-container" label-width="120px" ref="form" :rules="rules">
      <el-form-item label="告警组名称" prop="name">
        <el-input v-model="postForm.name"/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="postForm.remark" type="textarea"/>
      </el-form-item>
      <el-form-item label="读写权限" prop="permission">
        <add-members-select v-model="postForm.permission" >
          <template v-if="!postForm.id" slot="before-tags">
            <select-member-tag :member="user" :closable="false" />
          </template>
        </add-members-select>
      </el-form-item>
      <alarm-group-channel-create
        ref="channelCreate"
        v-model="postForm.receiver.channels"
        :showDinggroupFocus="true" />
      <el-form-item>
        <el-button v-if="postForm.id" type="primary" @click="updateGroup" :loading="formLoading" :disabled="disabledSave">保存</el-button>
        <el-button v-else type="primary" @click="storeGroup" :loading="formLoading">创建</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import AddMembersSelect from '@/views/components/AddMembers/Select'
import { showGroup, storeGroup, updateGroup } from '@/api/alarmgroup'
import { formatInObjectNumber } from '@/utils/helpers'
import AlarmGroupChannelCreate from './components/ChannelCreate'
import { CHANNELS, CHANNEL_WEBHOOK } from '@/consts/alarm'
import SelectMemberTag from '@/views/components/AddMembers/SelectMemberTag'
import { ROLE_ADMIN } from '@/consts/app'

const channelsData = {}
Object.keys(CHANNELS).forEach(channel => {
  if (channel === CHANNEL_WEBHOOK) {
    channelsData[channel] = {
      url: ''
    }
  } else {
    channelsData[channel] = []
  }
})

export default {
  name: 'AlarmManageGroupCreate',
  components: { AddMembersSelect, AlarmGroupChannelCreate, SelectMemberTag },
  data () {
    return {
      postForm: {
        id: null,
        name: null,
        remark: null,
        receiver: {
          channels: {
            dinggroupfocus: null,
            enableDinggroupFocus: false,
            ...JSON.parse(JSON.stringify(channelsData))
          }
        },
        permission: []
      },
      rules: {},
      formLoading: false,
      disabledSave: false
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    manual () {
      return this.$store.state.settings.copyright.manual
    }
  },
  created () {
    if (this.$route.params['groupId']) {
      this.showGroup(Number(this.$route.params['groupId']), this.$route.name === 'AlarmGroupSaveAs')
    }
  },
  methods: {
    // 创建
    storeGroup () {
      if (this.validPostData() === false) {
        return
      }
      const data = this.getPostData()

      this.formLoading = true
      storeGroup(data)
        .then(res => {
          this.groupStoreAndUpdateUtil(res.data.nullPhoneUsers)
        }).finally(() => {
          this.formLoading = false
        })
    },
    // 从表单数据中提取可以请求接口的数据
    getPostData () {
      const data = {
        name: this.postForm.name,
        remark: this.postForm.remark,
        receiver: {
          channels: this.$refs.channelCreate.getFormData(undefined, true)
        },
        permission: this.postForm.permission.map(row => row.uid)
      }
      return data
    },
    // 校验表单数据是否合法
    validPostData () {
      const errors = []
      if (!this.postForm.name) {
        errors.push('告警组名称不能为空')
      }

      // 判断是否至少配置了一个通知渠道
      let channelLength = 0
      Object.keys(CHANNELS).forEach(channel => {
        if (
          (channel == CHANNEL_WEBHOOK && this.postForm.receiver.channels[channel].url) ||
          (channel != CHANNEL_WEBHOOK && this.postForm.receiver.channels[channel].length > 0)
        ) {
          channelLength++
        }
      })
      if (channelLength === 0) {
        errors.push('至少需配置一个通知渠道')
      }

      if (errors.length > 0) {
        this.$message({ type: 'error', message: errors.join('<br>'), dangerouslyUseHTMLString: true })
        return false
      }

      // 编辑时权限不能为空
      if (this.postForm.id && this.postForm.permission.length === 0) {
        this.$message({ type: 'error', message: '权限不能为空，请至少选择一个' })
        return false
      }

      return true
    },
    // 获取详情
    showGroup (groupId, saveAs = false) {
      showGroup(groupId)
        .then(res => {
          // 避免返回某些字段为空
          const group = formatInObjectNumber(res.data.alarmgroup, ['id'])
          if (saveAs) {
            group.id = null
          }

          this.postForm = group
          this.$set(this.postForm.receiver.channels, 'enableDinggroupFocus',
            !!this.postForm.receiver.channels.dinggroupfocus)

          // 提醒没权限用户
          if (
            !saveAs &&
            this.$store.state.user.permission.role != ROLE_ADMIN &&
            group.permission.filter(row => row.uid == this.user.uid).length === 0
          ) {
            this.$alert('您没有该告警通知组的编辑权限，编辑之后将无法保存，请勿编辑。如果您需要修改，请另存为或者联系有权限的老师给您添加权限。', '无权限提醒', {
              confirmButtonText: '我知道了',
              type: 'warning'
            })
            this.disabledSave = true
          }
        })
    },
    // 更新
    updateGroup () {
      if (this.validPostData() === false) {
        return
      }

      const data = this.getPostData()
      data['id'] = this.postForm.id

      this.formLoading = true
      updateGroup(data)
        .then(res => {
          this.groupStoreAndUpdateUtil(res.data.nullPhoneUsers)
        }).finally(() => {
          this.formLoading = false
        })
    },
    // 后端返回没电话号的用户，前端提示
    groupStoreAndUpdateUtil (nullPhoneUsers) {
      if (!nullPhoneUsers || nullPhoneUsers.length == 0) {
        this.$message.success('保存成功')
        this.$router.push({ name: 'AlarmGroup' })
      } else {
        let msg = '<p class="text-danger">以下用户未配置手机号，会导致无法接收短信、电话告警通知，请点击右上角个人头像进入用户信息页完善手机号：</p><ul>'
        nullPhoneUsers.forEach(item => {
          msg += `<li>${item.username}（${item.user}）</li>`
        })
        msg += '</ul>'
        msg += `<p>详情请参考文档：<a href="${this.manual}faq/cannot-receiver-sms-phone.html" target="_blank" class="text-link">收不到短信和电话告警通知</a></p>`

        this.$alert(msg, '已保存', {
          confirmButtonText: '我已知晓',
          dangerouslyUseHTMLString: true,
          callback: action => {
            this.$router.push({ name: 'AlarmGroup' })
          } })
      }
    },
    goBack () {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push({ name: 'AlarmGroup' })
    }
  }
}
</script>
