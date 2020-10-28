const steps = [
  {
    element: '#version-env',
    popover: {
      title: '环境识别',
      description: '请注意查看这里是生产环境还是测试环境，不要弄混哦',
      position: 'top'
    }
  },
  {
    element: '#selector-bu',
    popover: {
      title: '事业部切换',
      description: '不要忘记切换到自己的事业部哦',
      position: 'left'
    }
  },
  {
    element: '#btn-task-create',
    popover: {
      title: '创建任务',
      description: '点此按钮可以创建一个告警任务',
      position: 'left'
    }
  },
  {
    element: '#user-dropdown',
    popover: {
      title: '用户信息完善',
      description: '如果您告警使用了短信、电话通知渠道，请务必点此下拉菜单然后点击用户信息，完善手机号',
      position: 'left-top'
    }
  },
  {
    element: '#menu-history',
    popover: {
      title: '告警记录',
      description: '如果您需要查询告警发送的记录，可以点这个菜单',
      position: 'right'
    }
  },
  {
    element: '#menu-manual',
    popover: {
      title: '使用文档',
      description: '如果您想了解更多，可以点击此处查看使用文档',
      position: 'right'
    }
  },
  {
    element: '#contact-us',
    popover: {
      title: '联系我们',
      description: '如果您仍有通过文档解决不了的问题，可以联系我们哦',
      position: 'top-right'
    }
  }
]

export default steps
