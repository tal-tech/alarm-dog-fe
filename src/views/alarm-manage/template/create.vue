<template>
  <div class="app-container">
    <el-form v-model="postForm" class="form-container" label-width="120px" ref="form" :rules="rules">
      <el-form-item label="模板名称" prop="name">
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

      <el-alert
        type="success"
        :closable="false"
        style="margin-bottom: 20px"
        show-icon >
        <template #title>
          告警模板使用说明请参考：
          <el-link type="primary" :href="`${manual}advance-function/alarm-template.html`" target="_blank">
            告警模板使用文档
          </el-link>
        </template>
      </el-alert>

      <template-editor
        ref="templateEditor"
        :template="postForm.template"
        :setDefaultsTpl="setDefaultsTpl"
        @set-template="setTemplate" />

      <el-form-item>
        <el-button v-if="postForm.id" type="primary" @click="updateTemplate" :loading="formLoading" :disabled="disabledSave">保存</el-button>
        <el-button v-else type="primary" @click="storeTemplate" :loading="formLoading">创建</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { showTemplate, storeTemplate, updateTemplate } from '@/api/alarmtemplate'
import { formatInObjectNumber } from '@/utils/helpers'
import TemplateEditor from './components/TemplateEditor'
import {
  templateScenes
} from '@/consts/alarm'
import AddMembersSelect from '@/views/components/AddMembers/Select'
import SelectMemberTag from '@/views/components/AddMembers/SelectMemberTag'
import { ROLE_ADMIN } from '@/consts/app'

export default {
  name: 'AlarmManageTemplateCreate',
  components: { TemplateEditor, AddMembersSelect, SelectMemberTag },
  data () {
    return {
      postForm: {
        id: null,
        name: null,
        remark: null,
        template: {},
        permission: []
      },
      templateScenes,
      rules: {},
      formLoading: false,
      defaults: {},
      setDefaultsTpl: false,
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
    if (this.$route.params['templateId']) {
      this.showTemplate(Number(this.$route.params['templateId']), this.$route.name === 'AlarmTemplateSaveAs')
    } else {
      this.setDefaultsTpl = true
    }
  },
  methods: {
    // 事件触发设置template的值
    setTemplate (template) {
      this.$set(this.postForm, 'template', template)
    },
    // 创建
    storeTemplate () {
      const data = this.getPostData()

      if (this.validPostData(data) === false) {
        return
      }

      this.formLoading = true
      storeTemplate(data)
        .then(res => {
          this.$message.success('创建成功')
          this.$router.push({ name: 'AlarmTemplate' })
        }).finally(() => {
          this.formLoading = false
        })
    },
    // 从表单数据中提取可以请求接口的数据
    getPostData () {
      return {
        name: this.postForm.name,
        remark: this.postForm.remark,
        template: this.$refs.templateEditor.getFormData(),
        permission: this.postForm.permission.map(row => row.uid)
      }
    },
    // 校验表单数据是否合法
    validPostData (data) {
      const errors = []
      if (!data.name) {
        errors.push('模板名称不能为空')
      }
      if (Object.keys(data.template).length === 0) {
        errors.push('请至少自定义配置一个告警模板')
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
    showTemplate (templateId, saveAs = false) {
      showTemplate(templateId)
        .then(res => {
          const template = formatInObjectNumber(res.data.template, ['id'])
          if (saveAs) {
            template.id = null
          }
          this.postForm = template

          // 提醒没权限用户
          if (
            !saveAs &&
            this.$store.state.user.permission.role != ROLE_ADMIN &&
            template.permission.filter(row => row.uid == this.user.uid).length === 0
          ) {
            this.$alert('您没有该告警通知模板的编辑权限，编辑之后将无法保存，请勿编辑。如果您需要修改，请另存为或者联系有权限的老师给您添加权限。', '无权限提醒', {
              confirmButtonText: '我知道了',
              type: 'warning'
            })
            this.disabledSave = true
          }
        })
    },
    // 更新
    updateTemplate () {
      const data = this.getPostData()
      data['id'] = this.postForm.id

      if (this.validPostData(data) === false) {
        return
      }

      this.formLoading = true
      updateTemplate(data)
        .then(res => {
          this.$message.success('更新成功')
          this.$router.push({ name: 'AlarmTemplate' })
        }).finally(() => {
          this.formLoading = false
        })
    },
    goBack () {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push({ name: 'AlarmTemplate' })
    }
  }
}
</script>
