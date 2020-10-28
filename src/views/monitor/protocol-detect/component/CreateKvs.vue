<template>
  <div>
    <div class="items-control">
      <el-button type="primary" size="mini" @click="addItem">{{ btnTxt }}</el-button>
    </div>
    <div class="items-list">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="items-item">
        <el-input
          v-model="item.key"
          size="small"
          :placeholder="keyPlaceholder"
          style="width: 160px" />
        <el-input
          v-model="item.value"
          size="small"
          :placeholder="valuePlaceholder"
          style="width: 420px" />
        <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="removeItem(index)" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DatasourceCreatekKvs',
  model: {
    prop: 'items'
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    keyPlaceholder: {
      type: String,
      default: '键名'
    },
    valuePlaceholder: {
      type: String,
      default: '键值'
    },
    btnTxt: {
      type: String,
      default: '添加参数'
    }
  },
  methods: {
    // 添加字段
    addItem () {
      this.items.push({
        key: null,
        value: null
      })
    },
    // 移除字段
    removeItem (index) {
      this.items.splice(index, 1)
    },
    // 获取表单数据
    getFormData (scene = '') {
      const kvs = {}
      this.items.forEach(item => {
        if (!item.key) {
          throw new Error(`${scene}${this.keyPlaceholder}不能为空`)
        }
        if (!item.value) {
          throw new Error(`${scene}${this.valuePlaceholder}不能为空`)
        }
        kvs[item.key] = item.value
      })

      return kvs
    },
    // 初始化编辑的form
    initEditForm (kvs) {
      const items = []
      for (const key in kvs) {
        items.push({
          key: key,
          value: kvs[key]
        })
      }
      return items
    }
  }
}
</script>
