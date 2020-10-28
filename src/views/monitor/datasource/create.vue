<template>
  <div class="app-container">
    <el-form :model="postForm" class="form-container" label-width="120px" ref="form" :rules="rules">
      <el-form-item label="名称" prop="name">
        <el-input v-model="postForm.name"/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="postForm.remark" type="textarea"/>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="postForm.type" placeholder="请选择数据源类型">
          <el-option
            v-for="(title, type) in DS_TYPES"
            :key="type"
            :label="title"
            :value="Number(type)">
          </el-option>
        </el-select>
      </el-form-item>

      <component
        v-if="postForm.type"
        v-model="postForm.config"
        ref="config"
        class="component-config"
        :is="configCompMap[postForm.type]"
        @set-config="setConfig" />

      <el-form-item label="字段" prop="fields">
        <div class="fields-control">
          <el-button type="primary" size="mini" @click="addField">添加字段</el-button>
          <el-button type="primary" size="mini" @click="importFields">自动导入</el-button>
        </div>
        <div class="fields-list">
          <div
            v-for="(iField, index) in postForm.fields.fields"
            :key="index"
            class="fields-item">
            <el-input
              v-model="iField.field"
              size="small"
              placeholder="字段名称，对象取值使用小数点连接"
              style="width: 280px" />
            <el-select v-model="iField.type" size="small" placeholder="字段类型" style="width: 100px">
              <el-option
                v-for="(title, type) in DS_FIELD_TYPES"
                :key="type"
                :label="title"
                :value="type">
              </el-option>
            </el-select>
            <el-input
              v-model="iField.label"
              size="small"
              placeholder="字段标签名，建议中文"
              style="width: 280px" />
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="removeField(index)" />
          </div>
        </div>
      </el-form-item>

      <el-form-item label="时间戳字段" prop="timestamp">
        <el-input
          v-model="postForm.timestamp_field"
          placeholder="字段中标记时间戳的字段"
          style="width: 280px" />

        <el-select
          v-model="postForm.timestamp_unit"
          placeholder="时间戳字段单位">
          <el-option
            v-for="(title, unit) in DS_TIMESTAMP_UNITS"
            :key="unit"
            :label="title"
            :value="Number(unit)">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button v-if="postForm.id" type="primary" @click="updateDatasource" :loading="formLoading">保存</el-button>
        <el-button v-else type="primary" @click="storeDatasource" :loading="formLoading">创建</el-button>
        <el-button type="success" @click="validConnect" :loading="formLoading">测试</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { showDatasource, storeDatasource, updateDatasource, validConnect } from '@/api/monitor/datasource'
import { formatInObjectNumber } from '@/utils/helpers'
import {
  DS_TYPE_ES,
  DS_TYPE_MYSQL,
  DS_TYPE_KAFKA,
  DS_TYPE_WEBHOOK,
  DS_TYPES,
  DS_FIELD_TYPES,
  DS_TIMESTAMP_UNITS,
  DS_TIMESTAMP_UNIT_SECOND
} from '@/consts/monitor'
import CreateElasticSearch from './component/CreateElasticSearch'
import CreateMysql from './component/CreateMysql'
import CreateKafka from './component/CreateKafka'
import CreateWebhook from './component/CreateWebhook'

export default {
  name: 'MonitorDatasouceCreate',
  components: {
    CreateElasticSearch, CreateMysql, CreateKafka, CreateWebhook
  },
  data () {
    return {
      postForm: {
        id: null,
        type: null,
        name: null,
        remark: null,
        config: {},
        fields: {
          fields: []
        },
        timestamp_field: null,
        timestamp_unit: DS_TIMESTAMP_UNIT_SECOND
      },
      DS_TYPES,
      DS_FIELD_TYPES,
      DS_TIMESTAMP_UNITS,
      formLoading: false,
      rules: {},
      configCompMap: {
        [DS_TYPE_ES]: CreateElasticSearch,
        [DS_TYPE_MYSQL]: CreateMysql,
        [DS_TYPE_KAFKA]: CreateKafka,
        [DS_TYPE_WEBHOOK]: CreateWebhook
      }
    }
  },
  created () {
    if (this.$route.params['datasourceId']) {
      this.$set(this.postForm, 'id', Number(this.$route.params['datasourceId']))
      this.showDatasource()
    }
  },
  methods: {
    // 创建
    storeDatasource () {
      if (this.validPostData() === false) {
        return
      }
      const data = this.getPostData()

      this.formLoading = true
      storeDatasource(data)
        .then(res => {
          this.$message.success('创建成功')
          this.$router.push({ name: 'MonitorDatasource' })
        }).finally(() => {
          this.formLoading = false
        })
    },
    // 从表单数据中提取可以请求接口的数据
    getPostData () {
      const data = {
        type: this.postForm.type,
        name: this.postForm.name,
        remark: this.postForm.remark,
        config: this.$refs.config.getFormData(),
        fields: this.postForm.fields,
        timestamp_field: this.postForm.timestamp_field,
        timestamp_unit: this.postForm.timestamp_unit
      }
      return data
    },
    // 校验表单数据是否合法
    validPostData () {
      const errors = []
      if (!this.postForm.name) {
        errors.push('告警组名称不能为空')
      }

      // 配置信息
      try {
        this.$refs.config.getFormData()
      } catch (e) {
        errors.push(e.message)
      }

      if (errors.length > 0) {
        this.$message({ type: 'error', message: errors.join('<br>'), dangerouslyUseHTMLString: true })
        return false
      }
      return true
    },
    // 获取详情
    showDatasource () {
      showDatasource(this.postForm.id)
        .then(res => {
          const datasource = formatInObjectNumber(res.data.datasource, ['id', 'timestamp_unit', 'type'])
          this.$set(this.postForm, 'type', datasource.type)
          this.$nextTick(() => {
            datasource['config'] = this.$refs.config.initEditForm(datasource.config)
            this.postForm = datasource
          })
        })
    },
    // 更新
    updateDatasource () {
      if (this.validPostData() === false) {
        return
      }

      const data = this.getPostData()
      data['id'] = this.postForm.id

      this.formLoading = true
      updateDatasource(data)
        .then(res => {
          this.$message.success('更新成功')
          this.$router.push({ name: 'MonitorDatasource' })
        }).finally(() => {
          this.formLoading = false
        })
    },
    goBack () {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push({ name: 'MonitorDatasource' })
    },
    // 设置config的值
    setConfig (config) {
      this.$set(this.postForm, 'config', JSON.parse(JSON.stringify(config)))
    },
    // 导入字段
    importFields () {
      this.$message.info('暂不支持，敬请期待')
    },
    // 添加字段
    addField () {
      this.postForm.fields.fields.push({
        field: null,
        type: null,
        label: null
      })
    },
    // 移除字段
    removeField (index) {
      this.postForm.fields.fields.splice(index, 1)
    },
    // 验证连接
    validConnect () {
      if (this.validPostData() === false) {
        return
      }
      const data = this.getPostData()

      validConnect(data)
        .then(res => {
          this.$message.success('验证通过')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.component-config {
  padding: 10px 10px 0 0;
  border: 2px dashed #eee;
}
</style>
