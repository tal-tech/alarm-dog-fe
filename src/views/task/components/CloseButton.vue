<template>
  <button type="button" class="el-dialog__headerbtn close-button" @click="$emit('click', $event)">
    <i class="el-icon-close"></i>
  </button>
</template>

<script>
export default {
  name: 'CloseButton'
}
</script>

<style lang="scss" scoped>
  .close-button {
    position: inherit;
  }
</style>
