<template>
  <div class="ds-box" v-if="row.type == DS_TYPE_ES">
    <div class="ds-icon">
      <svg-icon icon-class="elasticsearch"></svg-icon>
    </div>
    <div class="ds-text">
      <h2 class="ds-name ds-text-overflow">{{ row.name }}</h2>
      <div class="ds-attr ds-text-overflow">
        {{ renderESNodes(row.config.nodes) }} <br>
        {{ row.config.index }}
      </div>
    </div>
  </div>
  <div class="ds-box" v-else-if="row.type == DS_TYPE_MYSQL">
    <div class="ds-icon">
      <svg-icon icon-class="mysql"></svg-icon>
    </div>
    <div class="ds-text">
      <h2 class="ds-name ds-text-overflow">{{ row.name }}</h2>
      <div class="ds-attr ds-text-overflow">
        {{ row.config.host }}:{{ row.config.port }} <br>
        {{ row.config.database }}/{{ row.config.table }}
      </div>
    </div>
  </div>
  <div class="ds-box" v-else-if="row.type == DS_TYPE_KAFKA">
    <div class="ds-icon">
      <svg-icon icon-class="kafka"></svg-icon>
    </div>
    <div class="ds-text">
      <h2 class="ds-name ds-text-overflow">{{ row.name }}</h2>
      <div class="ds-attr ds-text-overflow">
        {{ row.config.consumer_proxy }} <br>
        {{ row.config.topic }}
      </div>
    </div>
  </div>
  <div class="ds-box" v-else-if="row.type == DS_TYPE_WEBHOOK">
    <div class="ds-icon">
      <svg-icon icon-class="webhook"></svg-icon>
    </div>
    <div class="ds-text">
      <h2 class="ds-name ds-text-overflow">{{ row.name }}</h2>
      <div class="ds-attr ds-text-overflow-2line">
        {{ row.config.method }} {{ row.config.url }}
      </div>
    </div>
  </div>
  <div class="ds-box" v-else>
    <div class="ds-icon">
      <svg-icon icon-class="ds-other"></svg-icon>
    </div>
    <div class="ds-text">
      <h2 class="ds-name ds-text-overflow">{{ row.name }}</h2>
      <div class="ds-attr ds-text-overflow-2line">
        not support datasource type
      </div>
    </div>
  </div>
</template>

<script>
import {
  DS_TYPE_ES,
  DS_TYPE_MYSQL,
  DS_TYPE_KAFKA,
  DS_TYPE_WEBHOOK
} from '@/consts/monitor'

export default {
  name: 'DatasourceName',
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      DS_TYPE_ES,
      DS_TYPE_MYSQL,
      DS_TYPE_KAFKA,
      DS_TYPE_WEBHOOK
    }
  },
  methods: {
    renderESNodes (nodes) {
      return nodes.map(item => `${item.host}:${item.port}`).join(', ')
    }
  }
}
</script>

<style lang="scss" scoped>
.ds-box {
  position: relative;
}
.ds-icon {
  font-size: 72px;
  position: absolute;
}
.ds-text {
  position: relative;
  left: 80px;
}
.ds-name {
  margin: 0 0 5px 0;
  padding: 0;
  font-size: 16px;
  color: #303133;
}
.ds-attr {
  font-size: 14px;
  color: #606266;
}
.ds-text-overflow {
  width:220px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.ds-text-overflow-2line {
  width:220px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
