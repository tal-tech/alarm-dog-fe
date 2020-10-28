import request from '@/utils/request'

export function tasks (page = 1, pageSize = 20, departmentId = null, search = null, tagId = null) {
  return request({
    url: 'alarmtask',
    method: 'get',
    params: { search, page, pageSize, departmentId, tagId }
  })
}

export function simpleTasks (search = null, pageSize = 20, departmentId = null) {
  return request({
    url: 'alarmtask/simple',
    method: 'get',
    params: { search, pageSize, department_id: departmentId }
  })
}

export function simpleAllTasks (search = null, pageSize = 20, departmentId = null) {
  return request({
    url: 'alarmtask/simpleall',
    method: 'get',
    params: { search, pageSize, department_id: departmentId }
  })
}

// 保存任务
export function storeTask (data) {
  return request({
    url: 'alarmtask/store',
    method: 'post',
    data
  })
}

// 更新任务
export function updateTask (data) {
  return request({
    url: 'alarmtask/update',
    method: 'put',
    data
  })
}

// 任务详情
export function showTask (id) {
  return request({
    url: 'alarmtask/show',
    method: 'get',
    params: { id }
  })
}

// 删除任务
export function deleteTask (id) {
  return request({
    url: 'alarmtask',
    method: 'delete',
    params: { id }
  })
}

// 停止任务
export function stopTask (id) {
  return request({
    url: 'alarmtask/stop',
    method: 'put',
    params: { id }
  })
}

// 启动/恢复任务
export function startTask (id) {
  return request({
    url: 'alarmtask/start',
    method: 'put',
    params: { id }
  })
}

// 暂停任务
export function pauseTask (id, time) {
  return request({
    url: 'alarmtask/pause',
    method: 'put',
    params: { id, time }
  })
}

// 校验机器人参数
export function validRobotParam (webtoken, secret, channels) {
  return request({
    url: 'alarmtask/validrobotparam',
    method: 'post',
    params: { webtoken, secret, channels }
  })
}

// 校验WebHook地址
export function validWebHookAddress (webhookUrl, event = 'PING', type = 'ping', data = null) {
  return request({
    url: 'alarmtask/validwebhookaddress',
    method: 'post',
    params: { event, type, webhook_url: webhookUrl, data }
  })
}

// 重置token
export function resetTaskToken (id) {
  return request({
    url: 'alarmtask/resettoken',
    method: 'put',
    params: { id }
  })
}

// 重置secret
export function resetTaskSecret (id) {
  return request({
    url: 'alarmtask/resetsecret',
    method: 'put',
    params: { id }
  })
}

// 发送告警
export function reportAlarm (taskId, ctn, level = null, noticeTime = null) {
  return request({
    url: 'alarmtask/reportalarm',
    method: 'post',
    data: { taskid: taskId, level, notice_time: noticeTime, ctn }
  })
}

// 查询阈值
export function getRateLimit (taskId) {
  return request({
    url: 'alarmtask/ratelimit',
    method: 'get',
    params: { taskid: taskId }
  })
}

// 修改阈值
export function updateRateLimit (taskId, rateLimit) {
  return request({
    url: 'alarmtask/ratelimit',
    method: 'put',
    params: { taskid: taskId, rate_limit: rateLimit }
  })
}

export function simpleByTag (tagId, search = null, pageSize = 20) {
  return request({
    url: 'alarmtask/simplebytag',
    method: 'get',
    params: { search, pageSize, tag_id: tagId }
  })
}
