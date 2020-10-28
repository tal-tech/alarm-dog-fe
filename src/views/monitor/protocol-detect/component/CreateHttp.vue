<template>
  <div v-if="typeof config.url !== 'undefined'">
    <el-form-item label="URL" prop="url">
      <el-input v-model="config.url" placeholder="必须是合法的URL地址" />
    </el-form-item>
    <el-form-item label="请求方式" prop="type">
      <el-radio-group v-model="config.method">
        <el-radio
          v-for="(title, method) in PD_HTTP_METHODS"
          :key="method"
          :label="method">{{ title }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="请求Headers" prop="headers">
      <create-kvs
        ref="headerKvs"
        v-model="config.headers"
        btnTxt="添加header"
        keyPlaceholder="header名称"
        valuePlaceholder="header值" />
    </el-form-item>
    <el-form-item label="Query参数" prop="query">
      <create-kvs
        ref="queryKvs"
        v-model="config.query"
        btnTxt="添加query参数"
        keyPlaceholder="query参数名称"
        valuePlaceholder="query参数值" />
    </el-form-item>
    <el-form-item label="请求Body" prop="body">
      <div class="body-type">
        <el-radio-group v-model="config.body.type">
          <el-radio
            v-for="(title, type) in PD_HTTP_BODY_TYPES"
            :key="type"
            :label="type">{{ title }}</el-radio>
        </el-radio-group>
      </div>
      <create-kvs
        v-show="[PD_HTTP_BODY_TYPE_X_WWW_FORM, PD_HTTP_BODY_TYPE_FORM_DATA].indexOf(config.body.type) > -1"
        ref="bodyKvs"
        v-model="config.body.params"
        btnTxt="添加body参数"
        keyPlaceholder="body参数名称"
        valuePlaceholder="body参数值" />
      <el-input
        v-show="config.body.type == PD_HTTP_BODY_TYPE_TEXT"
        v-model="config.body.content"
        type="textarea"
        placeholder="请求body部分的内容" />
      <json-editor
        v-if="config.body.type == PD_HTTP_BODY_TYPE_JSON"
        v-model="config.body.json"
        style="line-height: 20px"
        placeholder="请输入JSON" />
    </el-form-item>
    <el-form-item label="网关鉴权" prop="need_gateway_auth">
      <el-radio-group v-model="config.need_gateway_auth">
        <el-radio :label="false">不需要</el-radio>
        <el-radio :label="true">需要</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="Basic认证" prop="basic_auth">
      <div style="font-weight: normal; color: #606266">
        HTTP用户名：
        <el-input
          v-model="config.http_user"
          size="small"
          clearable
          placeholder="Basic认证用户名"
          style="width: 260px; margin-right: 20px" />
        HTTP密码：
        <el-input
          v-model="config.http_password"
          size="small"
          clearable
          placeholder="Basic认证用户密码"
          style="width: 260px" />
      </div>
    </el-form-item>
  </div>
</template>

<script>
import { isUrl } from '@/utils/validate'
import {
  PD_HTTP_METHOD_GET,
  PD_HTTP_METHODS,
  PD_HTTP_BODY_TYPE_NONE,
  PD_HTTP_BODY_TYPE_JSON,
  PD_HTTP_BODY_TYPE_TEXT,
  PD_HTTP_BODY_TYPE_X_WWW_FORM,
  PD_HTTP_BODY_TYPE_FORM_DATA,
  PD_HTTP_BODY_TYPES
} from '@/consts/monitor'
import CreateKvs from './CreateKvs'
import JsonEditor from '@/components/JsonEditor'

export default {
  name: 'CreateHttp',
  components: {
    CreateKvs, JsonEditor
  },
  model: {
    prop: 'config'
  },
  props: {
    config: {
      type: Object,
      default: () => { return {} }
    }
  },
  data () {
    return {
      PD_HTTP_METHODS,
      PD_HTTP_BODY_TYPES,
      PD_HTTP_BODY_TYPE_NONE,
      PD_HTTP_BODY_TYPE_JSON,
      PD_HTTP_BODY_TYPE_TEXT,
      PD_HTTP_BODY_TYPE_X_WWW_FORM,
      PD_HTTP_BODY_TYPE_FORM_DATA
    }
  },
  created () {
    this.initEmptyForm()
  },
  methods: {
    // 初始化配置
    initEmptyForm () {
      const config = {
        url: '',
        method: PD_HTTP_METHOD_GET,
        headers: [],
        query: [],
        body: {
          type: PD_HTTP_BODY_TYPE_NONE,
          params: [],
          content: '',
          json: ''
        },
        need_gateway_auth: false,
        http_user: '',
        http_password: ''
      }
      this.$emit('set-config', config)
    },
    // 格式化填充表单
    initEditForm (config) {
      return {
        url: config.url,
        method: config.method,
        headers: this.$refs.headerKvs.initEditForm(config.headers || {}),
        query: this.$refs.queryKvs.initEditForm(config.query || {}),
        body: {
          type: config.body.type,
          params: this.$refs.bodyKvs.initEditForm(config.body.params || {}),
          content: config.body.content || '',
          json: config.body.type == PD_HTTP_BODY_TYPE_JSON ? this.jsonStringify(config.body.params) : ''
        },
        need_gateway_auth: Boolean(config.need_gateway_auth),
        http_user: config.http_user || '',
        http_password: config.http_password || ''
      }
    },
    // json parse
    jsonParse (str) {
      try {
        return JSON.parse(str)
      } catch (e) {
        return {}
      }
    },
    // json stringify
    jsonStringify (obj) {
      try {
        return JSON.stringify(obj)
      } catch (e) {
        return ''
      }
    },
    // 验证表单
    validForm () {
      if (!this.config.url) {
        throw new Error('URL地址必填')
      }
      if (!isUrl(this.config.url)) {
        throw new Error('URL地址必须是一个有效的URL')
      }
      // TODO 其他待完善
    },
    // 获取表单数据
    getFormData () {
      this.validForm()
      return {
        url: this.config.url,
        method: this.config.method,
        headers: this.$refs.headerKvs.getFormData(),
        query: this.$refs.queryKvs.getFormData(),
        body: {
          type: this.config.body.type,
          params: this.config.body.type == PD_HTTP_BODY_TYPE_JSON
            ? this.jsonParse(this.config.body.json)
            : this.$refs.bodyKvs.getFormData(),
          content: this.config.body.content || null
        },
        need_gateway_auth: this.config.need_gateway_auth,
        http_user: this.config.http_user,
        http_password: this.config.http_password
      }
    }
  }
}
</script>
