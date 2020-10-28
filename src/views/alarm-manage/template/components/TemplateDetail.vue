<template>
  <el-collapse v-model="modelCollapse" class="box-collapse">
    <el-collapse-item
      v-for="(sceneConf, scene) in templateScenes"
      :key="scene"
      :name="scene">
      <template slot="title">
        {{ sceneConf.title }}
        <el-tooltip placement="top" style="margin-left: 5px">
          <div slot="content">
            {{ sceneConf.tips }}
          </div>
          <i class="el-icon-question condition-item-tooltips" />
        </el-tooltip>
      </template>
      <template-detail-item :template="templates[scene]" />
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import {
  templateScenes
} from '@/consts/alarm'
import TemplateDetailItem from './TemplateDetailItem'

export default {
  name: 'TemplateDetail',
  components: { TemplateDetailItem },
  props: {
    templates: {
      type: Object,
      required: true
    },
    activeCollapse: {
      type: Array,
      default: () => { return [] }
    }
  },
  data () {
    return {
      templateScenes,
      modelCollapse: JSON.parse(JSON.stringify(this.activeCollapse))
    }
  }
}
</script>
