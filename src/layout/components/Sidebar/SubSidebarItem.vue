<template>
  <div class="menu-wrapper" :class="{'nest-menu': isNest}">
    <el-submenu ref="subMenu" :index="path" popper-append-to-body>
      <template slot="title">
        <item :icon="icon" :title="title" />
      </template>
      <slot />
    </el-submenu>
  </div>
</template>

<script>
import Item from './Item'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SubSidebarItem',
  components: { Item },
  mixins: [FixiOSBug],
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: ''
    },
    path: {
      type: String,
      default: ''
    },
    isNest: {
      type: Boolean,
      default: false
    }
  }
}
</script>
