<template>
  <div class="templates">
    <el-form-item
      v-for="(channelConf, channel) in templateChannels"
      :key="channel"
      :label="channelConf.title"
      prop="channel">
      <div>
        <template-type :type="template[channel].type" size="small" />
        <el-tag type="primary" size="small" style="margin-left: 5px">
          {{ templateFormats[template[channel].format] }}
        </el-tag>
      </div>
      <el-input
        v-model="template[channel].template"
        type="textarea"
        placeholder="(空模板)"
        :autosize="true"
        :readonly="true" />
    </el-form-item>
  </div>
</template>

<script>
import {
  templateChannels,
  templateFormats
} from '@/consts/alarm'
import TemplateType from './TemplateType'

export default {
  name: 'TemplateDetailItem',
  props: {
    template: {
      type: Object,
      required: true
    }
  },
  components: { TemplateType },
  data () {
    return {
      templateChannels,
      templateFormats
    }
  }
}
</script>
