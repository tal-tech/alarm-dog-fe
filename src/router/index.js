import Vue from 'vue'
import Router from 'vue-router'

/* Layout */
import Layout from '@/layout'
import EmptyRouterView from '@/layout/components/EmptyRouterView'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/full',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '告警总览' }
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Home',
    children: [
      {
        path: '/tasks',
        name: 'AlarmsTasks',
        component: EmptyRouterView,
        redirect: '/task',
        meta: { title: '告警任务' },
        children: [
          {
            path: '/task',
            name: 'AlarmTask',
            component: () => import('@/views/task/index'),
            meta: { title: '' }
          },
          {
            path: '/task/create',
            name: 'AlarmTaskCreate',
            component: () => import('@/views/task/create'),
            meta: { title: '创建告警任务', activeMenu: '/task' }
          },
          {
            path: '/task/:taskId(\\d+)/edit',
            name: 'AlarmTaskEdit',
            component: () => import('@/views/task/create'),
            meta: { title: '编辑告警任务', activeMenu: '/task' }
          },
          {
            path: '/task/:taskId(\\d+)/saveas',
            name: 'AlarmTaskSaveAs',
            component: () => import('@/views/task/create'),
            meta: { title: '另存为告警任务', activeMenu: '/task' }
          },
          {
            path: '/task/:taskId(\\d+)/show',
            name: 'AlarmTaskShow',
            component: () => import('@/views/task/show'),
            meta: { title: '告警任务详情', activeMenu: '/task' }
          }
        ]
      },
      {
        path: '/histories',
        name: 'AlarmHistories',
        component: EmptyRouterView,
        redirect: '/history',
        meta: { title: '告警记录' },
        children: [
          {
            path: '/history',
            name: 'AlarmHistory',
            component: () => import('@/views/history/index'),
            meta: { title: '' }
          },
          {
            path: '/history/:historyId(\\d+)/show',
            name: 'AlarmHistoryShow',
            component: () => import('@/views/history/detail'),
            meta: { title: '告警详情', activeMenu: '/history' }
          }
        ]
      },
      {
        path: '/workflows',
        name: 'AlarmWorkflows',
        component: EmptyRouterView,
        redirect: '/workflow',
        meta: { title: '告警处理' },
        children: [
          {
            path: '/workflow',
            name: 'AlarmWorkflow',
            component: () => import('@/views/workflow/index'),
            meta: { title: '' }
          },
          {
            path: '/workflow/:workflowId(\\d+)/show',
            name: 'AlarmWorkflowShow',
            component: () => import('@/views/workflow/detail'),
            meta: { title: '工作流详情', activeMenu: '/workflow' }
          }
        ]
      },
      {
        path: '/alarmmanage',
        name: 'AlarmManage',
        component: EmptyRouterView,
        redirect: '/alarmgroup',
        meta: { title: '告警管理' },
        children: [
          {
            path: '/alarmgroups',
            name: 'AlarmGroups',
            component: EmptyRouterView,
            redirect: '/alarmgroup',
            meta: { title: '告警通知组' },
            children: [
              {
                path: '/alarmgroup',
                name: 'AlarmGroup',
                component: () => import('@/views/alarm-manage/group/index'),
                meta: { title: '' }
              },
              {
                path: '/alarmgroup/create',
                name: 'AlarmGroupCreate',
                component: () => import('@/views/alarm-manage/group/create'),
                meta: { title: '创建告警组', activeMenu: '/alarmgroup' }
              },
              {
                path: '/alarmgroup/:groupId(\\d+)/edit',
                name: 'AlarmGroupEdit',
                component: () => import('@/views/alarm-manage/group/create'),
                meta: { title: '编辑告警组', activeMenu: '/alarmgroup' }
              },
              {
                path: '/alarmgroup/:groupId(\\d+)/saveas',
                name: 'AlarmGroupSaveAs',
                component: () => import('@/views/alarm-manage/group/create'),
                meta: { title: '另存为告警组', activeMenu: '/alarmgroup' }
              }
            ]
          },
          {
            path: '/alarmtemplates',
            name: 'AlarmTemplates',
            component: EmptyRouterView,
            redirect: '/alarmtemplate',
            meta: { title: '通知模板' },
            children: [
              {
                path: '/alarmtemplate',
                name: 'AlarmTemplate',
                component: () => import('@/views/alarm-manage/template/index'),
                meta: { title: '' }
              },
              {
                path: '/alarmtemplate/create',
                name: 'AlarmTemplateCreate',
                component: () => import('@/views/alarm-manage/template/create'),
                meta: { title: '创建模板', activeMenu: '/alarmtemplate' }
              },
              {
                path: '/alarmtemplate/:templateId(\\d+)/edit',
                name: 'AlarmTemplateEdit',
                component: () => import('@/views/alarm-manage/template/create'),
                meta: { title: '编辑模板', activeMenu: '/alarmtemplate' }
              },
              {
                path: '/alarmtemplate/:templateId(\\d+)/saveas',
                name: 'AlarmTemplateSaveAs',
                component: () => import('@/views/alarm-manage/template/create'),
                meta: { title: '另存为通知模板', activeMenu: '/alarmtemplate' }
              }
            ]
          },
          {
            path: '/alarmtags',
            name: 'AlarmTags',
            component: EmptyRouterView,
            redirect: '/alarmtag',
            meta: { title: '标签管理' },
            children: [
              {
                path: '/alarmtag',
                name: 'AlarmTag',
                component: () => import('@/views/alarm-manage/tag/index'),
                meta: { title: '', activeMenu: '/alarmtag' }
              }
            ]
          }
        ]
      },
      {
        path: '/adminmanage',
        name: 'AdminManage',
        component: EmptyRouterView,
        redirect: '/department',
        meta: { title: '后台管理' },
        children: [
          {
            path: '/department',
            name: 'Department',
            component: () => import('@/views/admin-manage/department/index'),
            meta: { title: '部门管理' }
          },
          {
            path: '/businessunit',
            name: 'BusinessUnit',
            component: () => import('@/views/admin-manage/business-unit/index'),
            meta: { title: '事业部管理' }
          }
        ]
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/views/user/profile'),
        meta: { title: '个人信息' }
      },
      {
        path: '/monitor',
        name: 'Monitor',
        component: EmptyRouterView,
        redirect: '/monitor/datasource',
        meta: { title: '监控管理' },
        children: [
          {
            path: '/monitor/datasources',
            name: 'MonitorDatasources',
            component: EmptyRouterView,
            redirect: '/monitor/datasource',
            meta: { title: '数据源' },
            children: [
              {
                path: '/monitor/datasource',
                name: 'MonitorDatasource',
                component: () => import('@/views/monitor/datasource/index'),
                meta: { title: '' }
              },
              {
                path: '/monitor/datasource/create',
                name: 'MonitorDatasourceCreate',
                component: () => import('@/views/monitor/datasource/create'),
                meta: { title: '创建数据源', activeMenu: '/monitor/datasource' }
              },
              {
                path: '/monitor/datasource/:datasourceId(\\d+)/edit',
                name: 'MonitorDatasourceEdit',
                component: () => import('@/views/monitor/datasource/create'),
                meta: { title: '编辑数据源', activeMenu: '/monitor/datasource' }
              }
            ]
          },
          {
            path: '/monitor/universals',
            name: 'MonitorUniversals',
            component: EmptyRouterView,
            redirect: '/monitor/universal',
            meta: { title: '通用监控' },
            children: [
              {
                path: '/monitor/universal',
                name: 'MonitorUniversal',
                component: () => import('@/views/monitor/universal/index'),
                meta: { title: '' }
              },
              {
                path: '/monitor/universal/create',
                name: 'MonitorUniversalCreate',
                component: () => import('@/views/monitor/universal/create'),
                meta: { title: '创建任务', activeMenu: '/monitor/universal' }
              },
              {
                path: '/monitor/universal/:taskId(\\d+)/edit',
                name: 'MonitorUniversalEdit',
                component: () => import('@/views/monitor/universal/create'),
                meta: { title: '编辑任务', activeMenu: '/monitor/universal' }
              }
            ]
          },
          {
            path: '/monitor/protocoldetects',
            name: 'MonitorProtocolDetects',
            component: EmptyRouterView,
            redirect: '/monitor/protocoldetect',
            meta: { title: '心跳探活' },
            children: [
              {
                path: '/monitor/protocoldetect',
                name: 'MonitorProtocolDetect',
                component: () => import('@/views/monitor/protocol-detect/index'),
                meta: { title: '' }
              },
              {
                path: '/monitor/protocoldetect/create',
                name: 'MonitorProtocolDetectCreate',
                component: () => import('@/views/monitor/protocol-detect/create'),
                meta: { title: '创建任务', activeMenu: '/monitor/protocoldetect' }
              },
              {
                path: '/monitor/protocoldetect/:taskId(\\d+)/edit',
                name: 'MonitorProtocolDetectEdit',
                component: () => import('@/views/monitor/protocol-detect/create'),
                meta: { title: '编辑任务', activeMenu: '/monitor/protocoldetect' }
              }
            ]
          },
          {
            path: '/monitor/cyclecompares',
            name: 'MonitorCycleCompares',
            component: EmptyRouterView,
            redirect: '/monitor/cyclecompare',
            meta: { title: '同比环比监控' },
            children: [
              {
                path: '/monitor/cyclecompare',
                name: 'MonitorCycleCompare',
                component: () => import('@/views/monitor/cyclecompare/index'),
                meta: { title: '' }
              },
              {
                path: '/monitor/cyclecompare/create',
                name: 'MonitorCycleCompareCreate',
                component: () => import('@/views/monitor/cyclecompare/create'),
                meta: { title: '创建任务', activeMenu: '/monitor/cyclecompare' }
              },
              {
                path: '/monitor/cyclecompare/:taskId(\\d+)/edit',
                name: 'MonitorCycleCompareEdit',
                component: () => import('@/views/monitor/cyclecompare/create'),
                meta: { title: '编辑任务', activeMenu: '/monitor/cyclecompare' }
              }
            ]
          }
        ]
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
