<template>
  <div class="templates" v-if="defaults[firstChannel]">
    <el-form-item
      v-for="(prop, channel) in templateChannels"
      :key="channel"
      :label="prop.title"
      :prop="channel">

      <template-item-editor
        :template="postForm[channel]"
        :channelProp="prop"
        :defaults="defaults[channel]"
        :scene="scene"
        :channel="channel"
        @reset="resetTextarea(channel)" />
    </el-form-item>
  </div>
</template>

<script>
import TemplateItemEditor from './TemplateItemEditor'
import {
  templateChannels,
  templateFormats
} from '@/consts/alarm'

export default {
  name: 'TemplateItem',
  components: { TemplateItemEditor },
  model: {
    prop: 'postForm'
  },
  props: {
    postForm: {
      type: Object,
      required: true
    },
    defaults: {
      type: Object,
      default: () => { return {} }
    },
    scene: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      templateChannels,
      templateFormats,
      firstChannel: Object.keys(templateChannels)[0]
    }
  },
  methods: {
    resetTextarea (key) {
      if (typeof this.defaults[key] !== 'undefined') {
        this.$set(this.postForm, key, JSON.parse(JSON.stringify(this.defaults[key])))
      }
    }
  }
}
</script>
