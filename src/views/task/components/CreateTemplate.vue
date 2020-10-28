<template>
  <el-form :model="postForm" class="form-container" label-width="120px" ref="form">
    <el-alert
      title="如果不选择预定义通知模板或者填写自定义通知模板，将使用系统默认通知模板；如果选择预定义通知模板，自定义通知模板将失效"
      type="info"
      :closable="false"
      style="margin-bottom: 20px"
      show-icon />

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

    <el-form-item label="预定义模板" prop="template_id">
      <el-select
        v-model="postForm.template_id"
        filterable
        remote
        clearable
        reserve-keyword
        size="small"
        placeholder="请输入关键词搜索告警通知模板"
        :remote-method="searchTemplate"
        :loading="searchLoading"
        style="width: 45%">
        <el-option
          v-for="template in templates"
          :key="template.id"
          :label="template.name"
          :value="Number(template.id)">
        </el-option>
      </el-select>

      <el-button v-show="postForm.template_id" type="primary" size="small" @click="showTemplate">
        查看模板详情
      </el-button>
    </el-form-item>

    <el-collapse v-show="!postForm.template_id" class="box-collapse" style="margin-bottom: 20px;">
      <el-collapse-item name="udf">
        <template slot="title">
          自定义告警通知模板
          <el-tooltip placement="top" style="margin-left: 5px">
            <div slot="content">
              单击该栏可以展开自定义配置告警通知模板
            </div>
            <i class="el-icon-question condition-item-tooltips" />
          </el-tooltip>
        </template>

        <template-editor
          ref="templateEditor"
          :template="postForm.udf"
          :setDefaultsTpl="setDefaultsTpl"
          @set-template="setTemplate" />

      </el-collapse-item>
    </el-collapse>

    <el-form-item>
      <el-button type="primary" @click="$emit('change-active', 'recovery')">上一步</el-button>
      <el-button type="success" @click="$emit('submmit-form')">保存</el-button>
      <el-button @click="$emit('go-back')">取消</el-button>
    </el-form-item>

    <!-- 模板详情 -->
    <template-dialog ref="templateDialog" />
  </el-form>
</template>

<script>
import { formatInArrayNumber, formatNumber } from '@/utils/helpers'
import { simpleTemplate } from '@/api/alarmtemplate'
import TemplateEditor from '@/views/alarm-manage/template/components/TemplateEditor'
import TemplateDialog from '@/views/alarm-manage/template/components/TemplateDialog'

export default {
  name: 'CreateTemplate',
  components: { TemplateDialog, TemplateEditor },
  model: {
    prop: 'postForm'
  },
  props: {
    postForm: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      templates: [],
      searchLoading: false,
      defaults: {},
      setDefaultsTpl: true
    }
  },
  computed: {
    manual () {
      return this.$store.state.settings.copyright.manual
    }
  },
  created () {

  },
  methods: {
    // 远程搜索模板
    searchTemplate (query) {
      if (query !== '') {
        this.searchLoading = true
        simpleTemplate(query)
          .then(res => {
            this.templates = formatInArrayNumber(res.data.templates, ['id'])
          }).finally(() => {
            this.searchLoading = false
          })
      }
    },
    // 事件触发设置template的值
    setTemplate (template) {
      this.$set(this.postForm, 'udf', template)
    },
    // 格式化表单
    getFormData () {
      const template = {}
      // 选择预定义模板
      if (this.postForm.template_id) {
        template['template_id'] = this.postForm.template_id
        return template
      }

      // 判断是否自定义模板
      const udf = this.$refs.templateEditor.getFormData()
      // 如果有自定义模板，返回自定义模板，如果没有返回模板ID为0
      if (Object.keys(udf).length > 0) {
        template['udf'] = udf
        return template
      }

      // 返回ID为0
      template['template_id'] = 0
      return template
    },
    // 查看告警模板详情
    showTemplate () {
      this.$refs.templateDialog.showTemplate(this.postForm.template_id)
    },
    // 初始化表单，编辑等数据回填时使用
    initForm (task) {
      if (task.template.template && task.template.template.id) {
        this.templates = [
          { id: Number(task.template.template.id), name: task.template.template.name }
        ]
      }
      const template = {
        template_id: task.template.template_id ? formatNumber(task.template.template_id, null) : null,
        udf: task.template.udf || JSON.parse(JSON.stringify(this.postForm.udf))
      }
      return template
    }
  }
}
</script>

<style lang="scss">

</style>
