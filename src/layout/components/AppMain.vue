<template>
  <section class="app-main" :style="appMainStyle">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key () {
      return this.$route.fullPath
    },
    appMainStyle () {
      const style = { }
      let offsetPx = 100
      if (this.$store.state.settings.fixedHeader) {
        style['paddingTop'] = '50px'
        offsetPx -= 50
      }
      if (this.$store.state.settings.fixedFooter) {
        style['paddingBottom'] = '50px'
        offsetPx -= 50
      }
      style['minHeight'] = `calc(100vh - ${offsetPx}px)`

      return style
    }
  }
}
</script>

<style scoped>
.app-main {
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>
