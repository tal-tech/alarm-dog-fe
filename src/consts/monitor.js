
/**
 * 数据源定义
 */
export const DS_TYPE_ES = 1
export const DS_TYPE_MYSQL = 2
export const DS_TYPE_KAFKA = 3
export const DS_TYPE_WEBHOOK = 4
export const DS_TYPES = {
  [DS_TYPE_ES]: 'ElasticSearch',
  [DS_TYPE_MYSQL]: 'MySQL',
  [DS_TYPE_KAFKA]: 'Kafka'
  // [DS_TYPE_WEBHOOK]: 'Webhook', // 暂时不开放webhook
}

/**
 * Webhook配置-请求方式
 */
export const DS_WEBHOOK_METHOD_GET = 'GET'
export const DS_WEBHOOK_METHOD_POST = 'POST'
export const DS_WEBHOOK_METHODS = {
  [DS_WEBHOOK_METHOD_GET]: 'GET',
  [DS_WEBHOOK_METHOD_POST]: 'POST'
}

/**
 * Webhook配置-body类型
 */
export const DS_WEBHOOK_BODY_TYPE_JSON = 'application/json'
export const DS_WEBHOOK_BODY_TYPE_TEXT = 'text/plain'
export const DS_WEBHOOK_BODY_TYPE_X_WWW_FORM = 'application/x-www-form-urlencoded'
export const DS_WEBHOOK_BODY_TYPE_FORM_DATA = 'multipart/form-data'
export const DS_WEBHOOK_BODY_TYPE_NONE = 'none'
export const DS_WEBHOOK_BODY_TYPES = {
  [DS_WEBHOOK_BODY_TYPE_NONE]: 'none',
  [DS_WEBHOOK_BODY_TYPE_JSON]: 'JSON',
  [DS_WEBHOOK_BODY_TYPE_TEXT]: 'raw',
  [DS_WEBHOOK_BODY_TYPE_X_WWW_FORM]: 'x-www-form-urlencoded',
  [DS_WEBHOOK_BODY_TYPE_FORM_DATA]: 'form-data'
}

/**
 * 数据源-字段定义-字段类型
 */
export const DS_FIELD_TYPE_FLOAT = 'float'
export const DS_FIELD_TYPE_INTEGER = 'integer'
export const DS_FIELD_TYPES = {
  [DS_FIELD_TYPE_FLOAT]: 'Float',
  [DS_FIELD_TYPE_INTEGER]: 'Integer'
}

/**
 * 数据源-时间字段单位
 */
export const DS_TIMESTAMP_UNIT_SECOND = 1
export const DS_TIMESTAMP_UNIT_MS = 2
export const DS_TIMESTAMP_UNIT_US = 3
export const DS_TIMESTAMP_UNIT_ISOSTR = 4
export const DS_TIMESTAMP_UNITS = {
  [DS_TIMESTAMP_UNIT_SECOND]: '秒(s)',
  [DS_TIMESTAMP_UNIT_MS]: '毫秒(ms)',
  [DS_TIMESTAMP_UNIT_US]: '微秒(μs)',
  [DS_TIMESTAMP_UNIT_ISOSTR]: 'ISO格式时间'
}

/**
 * 通用监控-聚合周期
 */
export const US_AGG_CYCLES = {
  60: '1min',
  120: '2min',
  180: '3min',
  300: '5min',
  600: '10min',
  900: '15min',
  1800: '30min',
  3600: '60min'
}

/**
 * 通用监控-过滤条件-操作符
 */
export const US_FILTER_OPERATOR_EQ = 'eq'
export const US_FILTER_OPERATOR_NEQ = 'neq'
export const US_FILTER_OPERATOR_GT = 'gt'
export const US_FILTER_OPERATOR_LT = 'lt'
export const US_FILTER_OPERATOR_GTE = 'gte'
export const US_FILTER_OPERATOR_LTE = 'lte'
export const US_FILTER_OPERATOR_IN = 'in'
export const US_FILTER_OPERATOR_NOT_IN = 'not-in'
export const US_FILTER_OPERATORS = {
  [US_FILTER_OPERATOR_EQ]: '等于',
  [US_FILTER_OPERATOR_NEQ]: '不等于',
  [US_FILTER_OPERATOR_GT]: '大于',
  [US_FILTER_OPERATOR_LT]: '小于',
  [US_FILTER_OPERATOR_GTE]: '不小于',
  [US_FILTER_OPERATOR_LTE]: '不大于',
  [US_FILTER_OPERATOR_IN]: '在范围内',
  [US_FILTER_OPERATOR_NOT_IN]: '不在范围内'
}

/**
 * 通用监控-告警条件-聚合方式
 */
export const US_ALARM_AGG_AVG = 'avg'
export const US_ALARM_AGG_MAX = 'max'
export const US_ALARM_AGG_MIN = 'min'
export const US_ALARM_AGG_SUM = 'sum'
export const US_ALARM_AGG_COUNT = 'count'
export const US_ALARM_AGG_LAST = 'last'
export const US_ALARM_AGGS = {
  [US_ALARM_AGG_AVG]: '平均值',
  [US_ALARM_AGG_MAX]: '最大值',
  [US_ALARM_AGG_MIN]: '最小值',
  [US_ALARM_AGG_SUM]: '求和',
  [US_ALARM_AGG_COUNT]: '计数'
  // [US_ALARM_AGG_LAST]: '最后一条记录', // 暂不支持
}

/**
 * 通用监控-告警条件条件-操作符
 */
export const US_ALARM_OPERATOR_EQ = 'eq'
export const US_ALARM_OPERATOR_NEQ = 'neq'
export const US_ALARM_OPERATOR_GT = 'gt'
export const US_ALARM_OPERATOR_LT = 'lt'
export const US_ALARM_OPERATOR_GTE = 'gte'
export const US_ALARM_OPERATOR_LTE = 'lte'
export const US_ALARM_OPERATOR_IN = 'in'
export const US_ALARM_OPERATOR_NOT_IN = 'not-in'
export const US_ALARM_OPERATORS = {
  [US_ALARM_OPERATOR_EQ]: '等于',
  [US_ALARM_OPERATOR_NEQ]: '不等于',
  [US_ALARM_OPERATOR_GT]: '大于',
  [US_ALARM_OPERATOR_LT]: '小于',
  [US_ALARM_OPERATOR_GTE]: '不小于',
  [US_ALARM_OPERATOR_LTE]: '不大于',
  [US_ALARM_OPERATOR_IN]: '在范围内',
  [US_ALARM_OPERATOR_NOT_IN]: '不在范围内'
}

/**
 * 同比环比-聚合周期
 */
export const CC_AGG_CYCLES = {
  60: '1min',
  120: '2min',
  180: '3min',
  300: '5min',
  600: '10min',
  900: '15min',
  1800: '30min',
  3600: '60min'
}

/**
 * 同比环比-参考周期
 */
export const CC_COMPARE_CYCLES = {
  600: '10min',
  1800: '30min',
  3600: '1h',
  43200: '12h',
  86400: '1天',
  172800: '2天',
  259200: '3天',
  604800: '1周',
  1209600: '2周',
  1296000: '15天',
  2592000: '30天'
}

/**
 * 同比环比-数据初始化-初始化方式
 */
export const CC_DATA_INIT_METHOD_WEBHOOK = 'webhook'
export const CC_DATA_INIT_METHOD_PUSH = 'push'
export const CC_DATA_INIT_METHOD_DATASOURCE = 'datasource'
export const CC_DATA_INIT_METHODS = {
  [CC_DATA_INIT_METHOD_DATASOURCE]: '从数据源初始化',
  [CC_DATA_INIT_METHOD_WEBHOOK]: 'WEBHOOK主动初始化',
  [CC_DATA_INIT_METHOD_PUSH]: 'PUSH被动初始化'
}

/**
 * 同比环比-过滤条件-操作符
 */
export const CC_FILTER_OPERATOR_EQ = 'eq'
export const CC_FILTER_OPERATOR_NEQ = 'neq'
export const CC_FILTER_OPERATOR_GT = 'gt'
export const CC_FILTER_OPERATOR_LT = 'lt'
export const CC_FILTER_OPERATOR_GTE = 'gte'
export const CC_FILTER_OPERATOR_LTE = 'lte'
export const CC_FILTER_OPERATOR_IN = 'in'
export const CC_FILTER_OPERATOR_NOT_IN = 'not-in'
export const CC_FILTER_OPERATORS = {
  [CC_FILTER_OPERATOR_EQ]: '等于',
  [CC_FILTER_OPERATOR_NEQ]: '不等于',
  [CC_FILTER_OPERATOR_GT]: '大于',
  [CC_FILTER_OPERATOR_LT]: '小于',
  [CC_FILTER_OPERATOR_GTE]: '不小于',
  [CC_FILTER_OPERATOR_LTE]: '不大于',
  [CC_FILTER_OPERATOR_IN]: '在范围内',
  [CC_FILTER_OPERATOR_NOT_IN]: '不在范围内'
}

/**
 * 同比环比-告警条件-聚合方式
 */
export const CC_ALARM_AGG_AVG = 'avg'
export const CC_ALARM_AGG_MAX = 'max'
export const CC_ALARM_AGG_MIN = 'min'
export const CC_ALARM_AGG_SUM = 'sum'
export const CC_ALARM_AGG_COUNT = 'count'
export const CC_ALARM_AGG_LAST = 'last'
export const CC_ALARM_AGGS = {
  [CC_ALARM_AGG_AVG]: '平均值',
  [CC_ALARM_AGG_MAX]: '最大值',
  [CC_ALARM_AGG_MIN]: '最小值',
  [CC_ALARM_AGG_SUM]: '求和',
  [CC_ALARM_AGG_COUNT]: '计数'
  // [CC_ALARM_AGG_LAST]: '最后一条记录', // 暂不支持
}

/**
 * 同比环比-告警条件-操作符类型
 */
export const CC_ALARM_OPERATOR_TYPE_FLOAT = 'float'
export const CC_ALARM_OPERATOR_TYPE_FLOAT_UP = 'float-up'
export const CC_ALARM_OPERATOR_TYPE_FLOAT_DOWN = 'float-down'
export const CC_ALARM_OPERATOR_TYPES = {
  [CC_ALARM_OPERATOR_TYPE_FLOAT]: '浮动',
  [CC_ALARM_OPERATOR_TYPE_FLOAT_UP]: '上浮',
  [CC_ALARM_OPERATOR_TYPE_FLOAT_DOWN]: '下浮'
}

/**
 * 同比环比-告警条件-操作符
 */
export const CC_ALARM_OPERATOR_EXCEED = 'exceed'
export const CC_ALARM_OPERATOR_NOT_EXCEED = 'not-exceed'
export const CC_ALARM_OPERATOR_EQ = 'eq'
export const CC_ALARM_OPERATOR_NEQ = 'neq'
export const CC_ALARM_OPERATORS = {
  [CC_ALARM_OPERATOR_EXCEED]: '超过',
  [CC_ALARM_OPERATOR_NOT_EXCEED]: '不超过',
  [CC_ALARM_OPERATOR_EQ]: '等于',
  [CC_ALARM_OPERATOR_NEQ]: '不等于'
}

/**
 * 同比环比-告警条件-阈值类型
 */
export const CC_ALARM_THRESHOLD_TYPE_THRESHOLD = 'threshold'
export const CC_ALARM_THRESHOLD_TYPE_PERCENT = 'percent'
export const CC_ALARM_THRESHOLD_TYPES = {
  [CC_ALARM_THRESHOLD_TYPE_THRESHOLD]: '阈值',
  [CC_ALARM_THRESHOLD_TYPE_PERCENT]: '百分比'
}

/**
 * 监控任务-任务状态
 */
export const TASK_STATUS_STARTING = 1
export const TASK_STATUS_STARTED = 2
export const TASK_STATUS_STOPPING = 3
export const TASK_STATUS_STOPPED = 4
export const TASK_STATUS_EDITED = 6
export const TASK_STATUSES = {
  [TASK_STATUS_STARTING]: '启动中',
  [TASK_STATUS_STARTED]: '已启动',
  [TASK_STATUS_STOPPING]: '停止中',
  [TASK_STATUS_STOPPED]: '已停止',
  [TASK_STATUS_EDITED]: '重启中'
}

/**
 * 心跳探活-监控频率
 */
export const PD_MONITOR_FREQUENCIES = {
  60: '1min',
  120: '2min',
  180: '3min',
  300: '5min',
  600: '10min',
  900: '15min',
  1800: '30min',
  3600: '60min'
}

/**
 * 心跳探活-协议
 */
export const PD_PROTOCOL_HTTP = 1
export const PD_PROTOCOL_TCP = 2
export const PD_PROTOCOL_UDP = 3
export const PD_PROTOCOL_DNS = 4
export const PD_PROTOCOLS = {
  [PD_PROTOCOL_HTTP]: 'HTTP'
  // [PD_PROTOCOL_TCP]: 'TCP',
  // [PD_PROTOCOL_UDP]: 'UDP',
  // [PD_PROTOCOL_DNS]: 'DNS',
}

/**
 * 心跳探活-HTTP-请求方式
 */
export const PD_HTTP_METHOD_GET = 'GET'
export const PD_HTTP_METHOD_POST = 'POST'
export const PD_HTTP_METHOD_PUT = 'PUT'
export const PD_HTTP_METHOD_PATCH = 'PATCH'
export const PD_HTTP_METHOD_DELETE = 'DELETE'
export const PD_HTTP_METHOD_HEAD = 'HEAD'
export const PD_HTTP_METHODS = {
  [PD_HTTP_METHOD_GET]: 'GET',
  [PD_HTTP_METHOD_POST]: 'POST',
  [PD_HTTP_METHOD_PUT]: 'PUT',
  [PD_HTTP_METHOD_PATCH]: 'PATCH',
  [PD_HTTP_METHOD_DELETE]: 'DELETE',
  [PD_HTTP_METHOD_HEAD]: 'HEAD'
}

/**
 * 心跳探活-HTTP-BODY参数类型
 */
export const PD_HTTP_BODY_TYPE_JSON = 'application/json'
export const PD_HTTP_BODY_TYPE_TEXT = 'text/plain'
export const PD_HTTP_BODY_TYPE_X_WWW_FORM = 'application/x-www-form-urlencoded'
export const PD_HTTP_BODY_TYPE_FORM_DATA = 'multipart/form-data'
export const PD_HTTP_BODY_TYPE_NONE = 'none'
export const PD_HTTP_BODY_TYPES = {
  [PD_HTTP_BODY_TYPE_NONE]: 'none',
  [PD_HTTP_BODY_TYPE_JSON]: 'JSON',
  [PD_HTTP_BODY_TYPE_TEXT]: 'raw',
  [PD_HTTP_BODY_TYPE_X_WWW_FORM]: 'x-www-form-urlencoded',
  [PD_HTTP_BODY_TYPE_FORM_DATA]: 'form-data'
}

/**
 * 心跳探活-DNS-类型
 */
export const PD_DNS_TYPE_A = 'A'
export const PD_DNS_TYPE_MX = 'MX'
export const PD_DNS_TYPE_CNAME = 'CNAME'
export const PD_DNS_TYPES = {
  [PD_DNS_TYPE_A]: 'A记录',
  [PD_DNS_TYPE_MX]: 'MX记录',
  [PD_DNS_TYPE_CNAME]: 'CNAME'
}

/**
 * 心跳探活-告警条件-操作符
 */
export const PD_ALARM_OPERATOR_EQ = 'eq'
export const PD_ALARM_OPERATOR_NEQ = 'neq'
export const PD_ALARM_OPERATOR_GT = 'gt'
export const PD_ALARM_OPERATOR_LT = 'lt'
export const PD_ALARM_OPERATOR_GTE = 'gte'
export const PD_ALARM_OPERATOR_LTE = 'lte'
export const PD_ALARM_OPERATOR_IN = 'in'
export const PD_ALARM_OPERATOR_NOT_IN = 'not-in'
export const PD_ALARM_OPERATOR_CONTAIN = 'contain'
export const PD_ALARM_OPERATOR_NOT_CONTAIN = 'not-contain'
export const PD_ALARM_OPERATOR_IP_MASK = 'ip-mask'
export const PD_ALARM_OPERATOR_DOMAIN_SUPPFIX = 'domain-suffix'
export const PD_ALARM_OPERATORS = {
  [PD_ALARM_OPERATOR_EQ]: '等于',
  [PD_ALARM_OPERATOR_NEQ]: '不等于',
  [PD_ALARM_OPERATOR_GT]: '大于',
  [PD_ALARM_OPERATOR_LT]: '小于',
  [PD_ALARM_OPERATOR_GTE]: '不小于',
  [PD_ALARM_OPERATOR_LTE]: '不大于',
  [PD_ALARM_OPERATOR_IN]: '在范围内',
  [PD_ALARM_OPERATOR_NOT_IN]: '不在范围内',
  [PD_ALARM_OPERATOR_CONTAIN]: '包含',
  [PD_ALARM_OPERATOR_NOT_CONTAIN]: '不包含',
  [PD_ALARM_OPERATOR_IP_MASK]: 'IP掩码',
  [PD_ALARM_OPERATOR_DOMAIN_SUPPFIX]: '域名通配符'
}

/**
 * 心跳探活-协议告警字段
 */
export const PD_ALARM_PROTOCOL_FIELDS = {
  [PD_PROTOCOL_HTTP]: {
    'http.status': '状态码',
    'http.headers': '响应头',
    'http.body': '响应body',
    'http.body_length': 'body长度',
    'http.body_json': '响应json',
    'http.request_time': '响应时间' // 单位：毫秒
  },
  [PD_PROTOCOL_TCP]: {
    'tcp.body': '响应body',
    'tcp.body_length': 'body长度',
    'tcp.body_json': '响应json',
    'tcp.request_time': '响应时间'
  },
  [PD_PROTOCOL_UDP]: {
    'udp.body': '响应body',
    'udp.body_length': 'body长度',
    'udp.body_json': '响应json',
    'udp.request_time': '响应时间'
  },
  [PD_PROTOCOL_DNS]: {
    'dns.host': '原host',
    'dns.type': 'DNS类型',
    'dns.target': '解析别名',
    'dns.ip': 'IPV4地址'
  }
}
