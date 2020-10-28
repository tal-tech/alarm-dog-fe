<template>
  <footer class="app-footer">
    <div class="copyright">
      Copyright ©2020 好未来教育集团-学而思网校
      All Rights Reserved | {{ copyright.version }} |
      <el-link type="primary" :href="copyright.manual" target="_blank" style="font-size: inherit">
        使用文档
      </el-link>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  computed: {
    copyright () {
      return this.$store.state.settings.copyright
    }
  }
}
</script>

<style scoped lang="scss">
  .app-footer {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    .copyright {
      width: 100%;
      padding-top: 16px;
      text-align: center;
      color: #666;
    }
  }
</style>
