<template>
  <div class="chart-card">
    <div class="chart-card__header">
      <span class="chart-card__header-title">{{ title }}</span>
      <span class="chart-card__header-action">
        <slot name="action"></slot>
      </span>
    </div>
    <div class="chart-card__content">
      <slot></slot>
    </div>
    <div class="chart-card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChartCard',
  props: {
    title: {
      required: true,
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-card {
  &__header {
    position: relative;
    color: rgba(0, 0, 0, .45);
    &-title {
      font-size: 14px;
      line-height: 22px;
    }
    &-action {
      cursor: pointer;
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  &__content {
    position: relative;
    margin: 4px 0;
  }
  &__footer {
    border-top: 1px solid #eee;
    padding-top: 9px;
    margin-top: 8px;
  }
}
</style>
