<template>
  <el-collapse v-model="modelCollapse" v-if="template[firstScene]" class="box-collapse" style="margin-bottom: 20px">
    <el-collapse-item
      v-for="(sceneConf, scene) in templateScenes"
      :key="scene"
      :name="scene">
      <template slot="title">
        {{ sceneConf.title }}
        <el-tooltip v-if="sceneConf.tips" placement="top" style="margin-left: 5px">
          <div slot="content">{{ sceneConf.tips }}</div>
          <i class="el-icon-question condition-item-tooltips" />
        </el-tooltip>
      </template>
      <template-item v-model="template[scene]" :scene="scene" :defaults="defaults[scene]" />
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import TemplateItem from './TemplateItem'
import { defaultTemplates } from '@/api/alarmtemplate'
import {
  templateScenes,
  templateChannels,
  TEMPLATE_FMT_TEXT
} from '@/consts/alarm'

const sceneTpls = {}
Object.keys(templateChannels).forEach(channel => {
  sceneTpls[channel] = {
    format: TEMPLATE_FMT_TEXT,
    template: ''
  }
})

const templateInit = {}
Object.keys(templateScenes).forEach(scene => {
  templateInit[scene] = JSON.parse(JSON.stringify(sceneTpls))
})

export default {
  name: 'TemplateEditor',
  components: { TemplateItem },
  model: {
    prop: 'template'
  },
  props: {
    template: {
      type: Object,
      required: true
    },
    setDefaultsTpl: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      templateScenes,
      defaults: {},
      firstScene: Object.keys(templateScenes)[0],
      modelCollapse: [Object.keys(templateScenes)[0]]
    }
  },
  created () {
    this.$emit('set-template', JSON.parse(JSON.stringify(templateInit)))
    this.initDefaultTemplates()
  },
  methods: {
    // 初始化默认模板
    initDefaultTemplates () {
      defaultTemplates()
        .then(res => {
          this.defaults = res.data.templates
          this.setDefaultsTpl && this.$emit('set-template', JSON.parse(JSON.stringify(this.defaults)))
        })
    },
    // 获取表单数据
    getFormData () {
      const template = {}
      for (const scene in this.defaults) {
        const sceneTemplate = {}
        for (const channel in this.defaults[scene]) {
          if (
            this.template[scene][channel].format == this.defaults[scene][channel].format &&
            this.template[scene][channel].template == this.defaults[scene][channel].template
          ) {
            // do nothing，默认模板不用提交
          } else {
            sceneTemplate[channel] = this.template[scene][channel]
          }
        }

        // 如果该场景有数据，则提交
        if (Object.keys(sceneTemplate).length > 0) {
          template[scene] = sceneTemplate
        }
      }

      return template
    }
  }
}
</script>
