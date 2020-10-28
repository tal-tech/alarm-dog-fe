
/**
 * 告警级别常量定义
 */

// 通知
export const LEVEL_NOTICE = 0
// 警告
export const LEVEL_WARN = 1
// 错误
export const LEVEL_ERROR = 2
// 紧急
export const LEVEL_CRITI = 3
// 继承
export const LEVEL_EXTEND = 9

// 列表（不包含继承类型）
export const levelsNoExtend = {
  [LEVEL_NOTICE]: '通知',
  [LEVEL_WARN]: '警告',
  [LEVEL_ERROR]: '错误',
  [LEVEL_CRITI]: '紧急'
}

// 列表
export const levels = {
  ...levelsNoExtend,
  [LEVEL_EXTEND]: '继承'
}

/**
 * 告警类型定义
 */

// 正常告警
export const ALARM_TYPE_NORMAL = 1
// 恢复告警
export const ALARM_TYPE_RECOVERY = 2
// 忽略告警
export const ALARM_TYPE_IGNORE = 3
// 列表
export const alarmTypes = {
  [ALARM_TYPE_NORMAL]: '正常告警',
  [ALARM_TYPE_RECOVERY]: '恢复告警',
  [ALARM_TYPE_IGNORE]: '忽略告警'
}

/**
 * 收敛、过滤条件
 */

// 等于自身
export const OP_EQ_SELF = 'eq-self'
// 等于
export const OP_EQ = 'eq'
// 不等于
export const OP_NEQ = 'neq'
// 字段存在
export const OP_ISSET = 'isset'
// 字段不存在
export const OP_NOT_ISSET = 'not-isset'
// 小于
export const OP_LT = 'lt'
// 大于
export const OP_GT = 'gt'
// 不大于
export const OP_LTE = 'lte'
// 不小于
export const OP_GTE = 'gte'
// 在范围内
export const OP_IN = 'in'
// 不在范围内
export const OP_NOT_IN = 'not-in'
// 包含
export const OP_CONTAIN = 'contain'
// 不包含
export const OP_NOT_CONTAIN = 'not-contain'

// 操作符列表
export const operators = {
  [OP_EQ_SELF]: '等于自身',
  [OP_EQ]: '等于',
  [OP_NEQ]: '不等于',
  [OP_ISSET]: '字段存在',
  [OP_NOT_ISSET]: '字段不存在',
  [OP_LT]: '小于',
  [OP_GT]: '大于',
  [OP_LTE]: '不大于',
  [OP_GTE]: '不小于',
  [OP_IN]: '在范围内',
  [OP_NOT_IN]: '不在范围内',
  [OP_CONTAIN]: '包含',
  [OP_NOT_CONTAIN]: '不包含'
}

// 只允许部分操作符
export function allowOperators (ops) {
  const allowOps = {}
  ops.forEach(op => {
    allowOps[op] = operators[op]
  })
  return allowOps
}

// 无阈值要求判断
export const NO_THRESHOLD = [OP_EQ_SELF, OP_ISSET, OP_NOT_ISSET]
export function noThreshold (operator) {
  return NO_THRESHOLD.indexOf(operator) > -1
}

/**
 * 分级告警-匹配模式
 */
export const RECV_DISPATCH_MODE_LAZY = 1
export const RECV_DISPATCH_MODE_UNLAZY = 2
export const RECV_DISPATCH_MODES = {
  [RECV_DISPATCH_MODE_LAZY]: '懒惰模式',
  [RECV_DISPATCH_MODE_UNLAZY]: '非懒惰模式'
}

/**
 * 工作流
 */

// 工作流状态
// 待处理
export const WORKFLOW_STATUS_PENDING = 0
// 处理中
export const WORKFLOW_STATUS_PROCESSING = 1
// 处理完成
export const WORKFLOW_STATUS_PROCESSED = 2
// 关闭
export const WORKFLOW_STATUS_CLOSED = 9

// 工作流pipeline非标准状态
// 提醒
export const WORKFLOW_STATUS_REMIND = 3
// 指派
export const WORKFLOW_STATUS_ASSIGN = 4
// 重新激活
export const WORKFLOW_STATUS_REACTIVE = 5

// 状态列表
export const workflowStatuses = {
  [WORKFLOW_STATUS_PENDING]: '待处理',
  [WORKFLOW_STATUS_PROCESSING]: '处理中',
  [WORKFLOW_STATUS_PROCESSED]: '处理完成',
  [WORKFLOW_STATUS_CLOSED]: '关闭',
  [WORKFLOW_STATUS_REMIND]: '提醒',
  [WORKFLOW_STATUS_ASSIGN]: '指派',
  [WORKFLOW_STATUS_REACTIVE]: '重新激活'
}

// 只允许部分状态列表
export function allowWorkflowStatuses (allowStatuses) {
  const allowMap = {}
  allowStatuses.forEach(status => {
    allowMap[status] = workflowStatuses[status]
  })
  return allowMap
}

/**
 * 任务相关枚举常量
 */

// 任务状态
// 已停止
export const TASK_STATUS_STOPPED = 0
// 运行中
export const TASK_STATUS_RUNNING = 1
// 已暂停
export const TASK_STATUS_PAUSE = 2

/**
 * 通知渠道
 */

export const CHANNEL_SMS = 'sms'
export const CHANNEL_PHONE = 'phone'
export const CHANNEL_EMAIL = 'email'
export const CHANNEL_DINGWORKER = 'dingworker'
export const CHANNEL_YACHWORKER = 'yachworker'
export const CHANNEL_WECHAT = 'wechat'
export const CHANNEL_DINGGROUP = 'dinggroup'
export const CHANNEL_DINGGROUP_TITLE = '钉钉机器人'
export const CHANNEL_YACHGROUP = 'yachgroup'
export const CHANNEL_YACHGROUP_TITLE = '知音楼机器人'
export const CHANNEL_WEBHOOK = 'webhook'
export const CHANNEL_WEBHOOK_TITLE = 'WebHook'

// 跟用户相关的通知渠道
export const CHANNELS_USER = {
  [CHANNEL_DINGWORKER]: '钉钉工作通知',
  [CHANNEL_YACHWORKER]: '知音楼工作通知',
  [CHANNEL_EMAIL]: '邮件通知',
  [CHANNEL_SMS]: '短信',
  [CHANNEL_PHONE]: '电话'
  // [CHANNEL_WECHAT]: '微信',
}

// 跟机器人相关的通知渠道
export const CHANNELS_ROBOT = {
  [CHANNEL_YACHGROUP]: CHANNEL_YACHGROUP_TITLE,
  [CHANNEL_DINGGROUP]: CHANNEL_DINGGROUP_TITLE
}

// 所有通知渠道
export const CHANNELS = {
  ...CHANNELS_USER,
  ...CHANNELS_ROBOT,
  [CHANNEL_WEBHOOK]: CHANNEL_WEBHOOK_TITLE
}

/**
 * 告警通知模板
 */

export const templateScenes = {
  compressed: { title: '告警被收敛', tips: '单击该栏可以展开自定义配置告警通知模板' },
  not_compress: { title: '告警未收敛', tips: '单击该栏可以展开自定义配置告警通知模板' },
  upgrade: { title: '告警升级', tips: '单击该栏可以展开自定义配置告警通知模板' },
  recovery: { title: '告警自动恢复', tips: '单击该栏可以展开自定义配置告警通知模板' }
}

// 模板变量
export const templateVars = {
  compressed: [
    {
      group: 'task',
      tips: '告警任务信息',
      vars: [
        { name: 'id', tips: '任务ID' },
        { name: 'name', tips: '任务名称' }
      ]
    },
    {
      group: 'history',
      tips: '告警记录',
      vars: [
        { name: 'id', tips: '记录ID' },
        { name: 'uuid', tips: '唯一ID' },
        { name: 'batch', tips: '收敛批次' },
        { name: 'metric', tips: '收敛指标' },
        { name: 'notice_time', tips: '告警通知时间' },
        { name: 'level', tips: '告警级别' },
        { name: 'ctn', tips: '告警内容，JSON格式' },
        { name: 'receiver', tips: '自定义通知人配置，JSON格式，如果未传参则为空' }
      ]
    },
    {
      group: 'common',
      tips: '系统变量',
      vars: [
        { name: 'env', tips: '环境标识，例如【生产环境】、【测试环境】' }
      ]
    }
  ],
  not_compress: [
    {
      group: 'task',
      tips: '告警任务信息',
      vars: [
        { name: 'id', tips: '任务ID' },
        { name: 'name', tips: '任务名称' }
      ]
    },
    {
      group: 'history',
      tips: '告警记录',
      vars: [
        { name: 'uuid', tips: '唯一ID' },
        { name: 'notice_time', tips: '告警通知时间' },
        { name: 'level', tips: '告警级别' },
        { name: 'ctn', tips: '告警内容，JSON格式' },
        { name: 'receiver', tips: '自定义通知人配置，JSON格式，如果未传参则为空' }
      ]
    },
    {
      group: 'common',
      tips: '系统变量',
      vars: [
        { name: 'env', tips: '环境标识，例如【生产环境】、【测试环境】' }
      ]
    }
  ],
  upgrade: [
    {
      group: 'task',
      tips: '告警任务信息',
      vars: [
        { name: 'id', tips: '任务ID' },
        { name: 'name', tips: '任务名称' }
      ]
    },
    {
      group: 'context',
      tips: '上下文配置信息',
      vars: [
        { name: 'rule', tips: '当前告警升级规则配置，JSON格式' },
        { name: 'zcount', tips: '触发规则的计数值' }
      ]
    },
    {
      group: 'history',
      tips: '告警记录',
      vars: [
        { name: 'id', tips: '记录ID' },
        { name: 'uuid', tips: '唯一ID' },
        { name: 'batch', tips: '收敛批次' },
        { name: 'metric', tips: '收敛指标' },
        { name: 'notice_time', tips: '告警通知时间' },
        { name: 'level', tips: '告警级别' },
        { name: 'ctn', tips: '告警内容，JSON格式' },
        { name: 'receiver', tips: '自定义通知人配置，JSON格式，如果未传参则为空' }
      ]
    },
    {
      group: 'common',
      tips: '系统变量',
      vars: [
        { name: 'env', tips: '环境标识，例如【生产环境】、【测试环境】' }
      ]
    }
  ],
  recovery: [
    {
      group: 'task',
      tips: '告警任务信息',
      vars: [
        { name: 'id', tips: '任务ID' },
        { name: 'name', tips: '任务名称' }
      ]
    },
    {
      group: 'history',
      tips: '告警记录',
      vars: [
        { name: 'uuid', tips: '唯一ID' },
        { name: 'notice_time', tips: '告警通知时间' },
        { name: 'level', tips: '告警级别' },
        { name: 'ctn', tips: '告警内容，JSON格式' },
        { name: 'receiver', tips: '自定义通知人配置，JSON格式，如果未传参则为空' }
      ]
    },
    {
      group: 'common',
      tips: '系统变量',
      vars: [
        { name: 'env', tips: '环境标识，例如【生产环境】、【测试环境】' }
      ]
    }
  ]
}

// 模板格式
export const TEMPLATE_FMT_TEXT = 1
export const TEMPLATE_FMT_MARKDOWN = 2
export const TEMPLATE_FMT_HTML = 3
export const TEMPLATE_FMT_ACTIONCARD = 4
// 所有格式及格式名称
export const templateFormats = {
  [TEMPLATE_FMT_TEXT]: '文本',
  [TEMPLATE_FMT_MARKDOWN]: 'Markdown',
  [TEMPLATE_FMT_HTML]: 'HTML',
  [TEMPLATE_FMT_ACTIONCARD]: 'ActionCard'
}

export const templateChannels = {
  [CHANNEL_DINGWORKER]: {
    title: '钉钉工作通知',
    formats: [TEMPLATE_FMT_TEXT, TEMPLATE_FMT_MARKDOWN]
  },
  [CHANNEL_YACHWORKER]: {
    title: '知音楼工作通知',
    formats: [TEMPLATE_FMT_TEXT, TEMPLATE_FMT_MARKDOWN]
  },
  [CHANNEL_EMAIL]: {
    title: '邮件通知',
    formats: [TEMPLATE_FMT_TEXT, TEMPLATE_FMT_HTML]
  },
  [CHANNEL_PHONE]: {
    title: '电话',
    formats: [TEMPLATE_FMT_TEXT]
  },
  [CHANNEL_SMS]: {
    title: '短信',
    formats: [TEMPLATE_FMT_TEXT]
  },
  [CHANNEL_YACHGROUP]: {
    title: CHANNEL_YACHGROUP_TITLE,
    formats: [TEMPLATE_FMT_TEXT, TEMPLATE_FMT_MARKDOWN]
  },
  [CHANNEL_DINGGROUP]: {
    title: CHANNEL_DINGGROUP_TITLE,
    formats: [TEMPLATE_FMT_TEXT, TEMPLATE_FMT_MARKDOWN]
  }
}

export const TEMPLATE_TYPE_DEFAULT = 0
export const TEMPLATE_TYPE_PREDEFINED = 1
export const TEMPLATE_TYPE_CUSTOM = 2
export const templateTypes = {
  [TEMPLATE_TYPE_DEFAULT]: '系统默认',
  [TEMPLATE_TYPE_PREDEFINED]: '预定义',
  [TEMPLATE_TYPE_CUSTOM]: '自定义'
}

/**
 * 收敛方式
 */
// 条件收敛
export const COMPRESS_METHOD_CONDITION = 1
// 相似收敛
export const COMPRESS_METHOD_SIMHASH = 2
// 内容收敛
export const COMPRESS_METHOD_CONTENT = 3
// 全量收敛
export const COMPRESS_METHOD_FULL = 4

export const compressMethods = {
  [COMPRESS_METHOD_CONDITION]: '条件收敛',
  // [COMPRESS_METHOD_SIMHASH]: '相似收敛',
  [COMPRESS_METHOD_CONTENT]: '内容收敛',
  [COMPRESS_METHOD_FULL]: '全量收敛'
}
