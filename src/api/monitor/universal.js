import request from '@/utils/request'

export function tasks (
  page = 1, pageSize = 20, search = null, order = { id: 'asc' }, departmentId = null, taskId = null,
  datasourceId = null, status = null
) {
  return request({
    url: 'monitor/universal',
    method: 'get',
    params: {
      search,
      page,
      pageSize,
      order,
      department_id: departmentId,
      task_id: taskId,
      datasource_id: datasourceId,
      status
    }
  })
}

export function simpleTasks (search = null, pageSize = 20) {
  return request({
    url: 'monitor/universal/simple',
    method: 'get',
    params: { search, pageSize }
  })
}

// 保存任务
export function storeTask (data) {
  return request({
    url: 'monitor/universal/store',
    method: 'post',
    data
  })
}

// 更新任务
export function updateTask (data) {
  return request({
    url: 'monitor/universal/update',
    method: 'put',
    data
  })
}

// 任务详情
export function showTask (id) {
  return request({
    url: 'monitor/universal/show',
    method: 'get',
    params: { id }
  })
}

// 删除任务
export function deleteTask (id) {
  return request({
    url: 'monitor/universal',
    method: 'delete',
    params: { id }
  })
}

// 停止任务
export function stopTask (id) {
  return request({
    url: 'monitor/universal/stop',
    method: 'put',
    params: { id }
  })
}

// 启动/恢复任务
export function startTask (id) {
  return request({
    url: 'monitor/universal/start',
    method: 'put',
    params: { id }
  })
}

// 重置token
export function resetTaskToken (id) {
  return request({
    url: 'monitor/universal/resettoken',
    method: 'put',
    params: { id }
  })
}
