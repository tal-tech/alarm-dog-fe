<template>
  <div>
    <div>
      <el-badge v-show="disabled" is-dot :hidden="hiddenBadge" class="tpl-btn-edit">
        <el-button type="success" size="mini" @click="handleEdit">
          编辑模板
        </el-button>
      </el-badge>
      <el-badge v-show="!disabled" is-dot :hidden="hiddenBadge" class="tpl-btn-edit">
        <el-button type="warning" size="mini" @click="handleReset">
          重置模板
        </el-button>
      </el-badge>

      <el-tooltip class="tpl-btn-var" effect="dark" content="单击可以显示或者隐藏模板可用变量侧栏说明" placement="top">
        <el-button type="primary" size="mini" @click="showVarView">
          {{ showVarTips ? '隐藏侧栏' : '模板变量' }}
        </el-button>
      </el-tooltip>

      <el-radio-group v-model="template.format">
        <el-radio
          v-for="(format, fmtIdx) in channelProp.formats"
          :key="fmtIdx"
          :label="format">{{ templateFormats[format] }}</el-radio>
      </el-radio-group>

    </div>

    <el-row class="row-textarea">
      <el-col :span="showVarTips ? 12 : 24">
        <el-input
          ref="textarea"
          v-model="template.template"
          type="textarea"
          :autosize="autosize"
          :placeholder="placeholder"
          :disabled="disabled"
          @keyup.enter.native="handleReheightVarTips"
          @resize.native="handleReheightVarTips"
          @keyup.delete.native="handleReheightVarTips" />
      </el-col>
      <el-col v-show="showVarTips" :span="12">
        <div class="var-tips-container" :style="{ height: varTipsHeight }">
          <ul class="var-tips-group-ul">
            <li
              v-for="(varGroup, groupIdx) in VarTips"
              :key="groupIdx"
              class="var-tips-group-li">
              <div class="var-tips-group-div">
                <span class="var-tips-group-name">{{ varGroup.group }}:</span>
                <span class="var-tips-group-tips">{{ varGroup.tips }}</span>
              </div>
              <ul class="var-tips-var-ul">
                <li
                  v-for="(varItem, varIdx) in varGroup.vars"
                  :key="varIdx"
                  class="var-tips-var-li">
                  <el-tooltip class="item" effect="dark" content="点击复制变量占位符" placement="top">
                    <el-button
                      class="var-tips-var-name"
                      type="success"
                      size="mini"
                      v-clipboard:copy="`{${varGroup.group}.${varItem.name}}`"
                      v-clipboard:success="copySuccess">
                      {{ varGroup.group }}.{{ varItem.name }}
                    </el-button>
                  </el-tooltip>
                  <span class="var-tips-var-tips">{{ varItem.tips }}</span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  templateFormats,
  templateVars
} from '@/consts/alarm'
import clipboard from '@/directive/clipboard/index.js'

export default {
  name: 'TemplateItemEditor',
  model: {
    prop: 'template'
  },
  props: {
    template: {
      type: Object,
      required: true
    },
    channelProp: {
      type: Object,
      required: true
    },
    autosize: {
      type: Object,
      default: () => { return { minRows: 2, maxRows: 20 } }
    },
    placeholder: {
      type: String,
      default: '模板为空时将使用系统默认模板'
    },
    defaults: {
      type: Object,
      required: true
    },
    scene: {
      type: String,
      required: true
    },
    channel: {
      type: String,
      required: true
    }
  },
  directives: {
    clipboard
  },
  data () {
    return {
      disabled: true,
      templateFormats,
      showVarTips: false,
      varTipsHeight: '100px',
      VarTips: templateVars[this.scene]
    }
  },
  computed: {
    hiddenBadge () {
      return this.template.template == this.defaults.template && this.template.format == this.defaults.format
    }
  },
  mounted () {
    this.$refs.textarea.$el.addEventListener('dblclick', this.handleEdit, false)
    this.$nextTick(() => {
      this.handleReheightVarTips()
    })
  },
  methods: {
    // 重新设置var tips的高度
    handleReheightVarTips () {
      this.varTipsHeight = this.$refs.textarea.$refs.textarea.style.height
    },
    // 开启编辑模式
    handleEdit () {
      this.disabled = false
      this.$nextTick(() => {
        this.$refs.textarea.focus()
      })
    },
    handleReset () {
      // 如果未做修改，直接reset
      if (this.hiddenBadge) {
        return this.handleResetConfirmed()
      }

      this.$confirm('确定要重置该模板为默认模板？重置之后所填写内容将被覆盖', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleResetConfirmed()
      }).catch(() => {
        // do nothing
      })
    },
    // 已确认rest
    handleResetConfirmed () {
      this.disabled = true
      this.$emit('reset')
    },
    showVarView () {
      this.showVarTips = !this.showVarTips
    },
    // 复制成功
    copySuccess (e) {
      this.$message.success(`复制成功 ${e.text}`)
      // 借助于复制重新设置var tips的高度，暂时解决无法监听textarea resize事件的问题
      this.handleReheightVarTips()
    }
  }
}
</script>

<style lang="scss" scoped>
.tpl-btn-edit {
  margin-right: 0;
  line-height: normal;
}
.tpl-btn-var {
  margin-left: 5px;
  margin-right: 15px;
}
.row-textarea {
  .var-tips-container {
    overflow: auto;
    line-height: 1.5em;
  }
}
.var-tips-group-ul {
  margin: 0;
}
.var-tips-group-name {
  font-weight: 600;
}
.var-tips-var-ul {
  padding-left: 1em;
}
.var-tips-var-li {
  line-height: 28px;
}
.var-tips-var-name {
  padding-top: 4px;
  padding-bottom: 4px;
}
.var-tips-var-tips {
  color: #7f8084;
}
</style>
