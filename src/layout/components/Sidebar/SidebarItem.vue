<template>
  <div class="menu-wrapper">
    <app-link :to="path">
      <el-menu-item :index="path" :class="{'submenu-title-noDropdown': !isNest}">
        <item :icon="icon" :title="title" />
      </el-menu-item>
    </app-link>
  </div>
</template>

<script>
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
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
      type: [String, Object, Array],
      default: ''
    },
    isNest: {
      type: Boolean,
      default: false
    }
  }
}
</script>
