<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <!-- 暂时屏蔽掉首页 -->
        <sidebar-item path="/dashboard" icon="dashboard" title="告警总览" />
        <sidebar-item path="/task" icon="task" title="告警任务" id="menu-task" />
        <sidebar-item path="/history" icon="history" title="告警记录" id="menu-history" />
        <sidebar-item path="/workflow" icon="workflow" title="工作流处理" id="menu-workflow" />
        <sub-sidebar-item path="/alarmmanage" icon="settings" title="告警管理">
          <sidebar-item path="/alarmgroup" icon="group" title="告警通知组" :is-nest="true" id="menu-alarmgroup" />
          <sidebar-item path="/alarmtemplate" icon="template" title="通知模板" :is-nest="true" id="menu-template" />
          <sidebar-item path="/alarmtag" icon="tag" title="标签管理" :is-nest="true" id="menu-alarmtag" />
        </sub-sidebar-item>
        <sub-sidebar-item path="/monitor" icon="monitor" title="监控管理">
          <sidebar-item path="/monitor/protocoldetect" icon="heart-detect" title="心跳探活" :is-nest="true" />
          <sidebar-item path="/monitor/universal" icon="universal-monitor" title="通用监控" :is-nest="true" />
          <sidebar-item path="/monitor/cyclecompare" icon="cycle-campare" title="同比环比监控" :is-nest="true" />
          <sidebar-item path="/monitor/datasource" icon="datasource" title="数据源" :is-nest="true" />
        </sub-sidebar-item>
        <sub-sidebar-item v-if="isAdmin" path="#" icon="admin" title="后台管理">
          <sidebar-item path="/department" icon="department" title="部门管理" :is-nest="true" />
          <sidebar-item path="/businessunit" icon="department" title="事业部管理" :is-nest="true" />
        </sub-sidebar-item>
        <sidebar-item :path="copyright.manual" icon="manual" title="使用文档" id="menu-manual" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import SubSidebarItem from './SubSidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, SubSidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    activeMenu () {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo () {
      return this.$store.state.settings.sidebarLogo
    },
    variables () {
      return variables
    },
    isCollapse () {
      return !this.sidebar.opened
    },
    copyright () {
      return this.$store.state.settings.copyright
    },
    isAdmin () {
      return this.$store.state.user.permission.role == 9
    }
  }
}
</script>
