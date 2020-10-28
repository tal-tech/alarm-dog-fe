<template>
  <div :class="[prefixCls, reverseColor && 'reverse-color' ]">
    <span>
      <slot name="term"></slot>
      <span class="item-text">
        <slot></slot>
      </span>
    </span>
    <span :class="[flag]"><i :class="iconClass"></i></span>
  </div>
</template>

<script>
export default {
  name: 'Trend',
  props: {
    prefixCls: {
      type: String,
      default: 'dog-trend'
    },
    /**
     * 上升下降标识：up|down
     */
    flag: {
      type: String,
      required: true
    },
    /**
     * 颜色反转
     */
    reverseColor: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    iconClass () {
      return `el-icon-caret-` + (this.flag == 'up' ? 'top' : 'bottom')
    }
  }
}
</script>

<style lang="scss" scoped>
.dog-trend {
  display: inline-block;
  font-size: 14px;
  line-height: 22px;

  .up,
  .down {
    margin-left: 4px;
    position: relative;
    top: 1px;
  }

  .item-text {
    display: inline-block;
    margin-left: 8px;
    color: rgba(0,0,0,.85);
  }

  .up {
    color: red;
  }
  .down {
    color: green;
    top: -1px;
  }

  &.reverse-color .up {
    color: green;
  }
  &.reverse-color .down {
    color: red;
  }
}
</style>
