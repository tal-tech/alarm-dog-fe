<template>
  <el-dialog
    title="告警模板详情"
    :visible.sync="dialogShowTemplate"
    width="60%"
  >
    <div v-if="showFilter" class="filter-container clearfix">
      <div class="filter-container-right clearfix">
        <router-link
          v-if="template.id"
          tag="a"
          :target="editBlank ? '_blank' : ''"
          :to="{ name: 'AlarmTemplateEdit', params: { templateId: template.id }}">
          <el-button type="primary" size="small">编辑</el-button>
        </router-link>
        <router-link
          v-if="template.id"
          tag="a"
          :target="editBlank ? '_blank' : ''"
          :to="{ name: 'AlarmTemplateSaveAs', params: { templateId: template.id }}">
          <el-button type="primary" size="small">另存为</el-button>
        </router-link>
      </div>
    </div>

    <el-form v-if="template.id" class="form-container compact-form" label-width="120px" ref="form">
      <el-form-item label="ID">
        {{ template.id }}
      </el-form-item>
      <el-form-item label="告警模板名称">
        {{ template.name }}
      </el-form-item>
      <el-form-item label="备注">
        {{ template.remark }}
      </el-form-item>
      <el-form-item label="创建时间">
        {{ template.created_at | formatDate }}
      </el-form-item>
      <el-form-item label="创建人">
        <template v-if="template.creator">
          <user :creator="template.creator" />
        </template>
        <template v-else>
          用户关联错误
        </template>
      </el-form-item>
      <el-form-item label="模板配置">
        <template-detail
          :templates="template.template"
          :activeCollapse="activeTemplateScene"
          style="margin-bottom: 20px; margin-top: 20px" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import TemplateDetail from './TemplateDetail'
import { formatDate } from '@/utils/filters'
import { formatInObjectNumber } from '@/utils/helpers'
import User from '@/views/components/User'
import { showTemplate } from '@/api/alarmtemplate'
import { templateScenes } from '@/consts/alarm'

export default {
  name: 'TemplateDialog',
  components: { TemplateDetail, User },
  filters: { formatDate },
  props: {
    showFilter: {
      type: Boolean,
      default: true
    },
    editBlank: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      dialogShowTemplate: false,
      template: {},
      activeTemplateScene: [Object.keys(templateScenes)[0]]
    }
  },
  methods: {
    showTemplate (id) {
      showTemplate(id)
        .then(res => {
          this.template = formatInObjectNumber(res.data.template, ['id'])
          this.dialogShowTemplate = true
        })
    }
  }
}
</script>
