import request from '@/utils/request'
import { formatTimerange } from '@/utils/helpers'

export function workflows (
  page = 1,
  pageSize = 20,
  status = null,
  departmentId = null,
  taskId = null,
  search = null,
  timerange = [],
  order = { updated_at: 'desc' },
  tagId = null
) {
  const params = { search, page, pageSize, departmentId, taskId, status, order, tagId }
  formatTimerange(timerange, params)
  return request({
    url: 'workflow',
    method: 'get',
    params
  })
}

export function showWorkflow (id) {
  return request({
    url: 'workflow/show',
    method: 'get',
    params: { id }
  })
}

// 根据状态统计
export function statisticsByStatus (
  departmentId = null,
  taskId = null,
  timerange = [],
  tagId = null
) {
  const params = { departmentId, taskId, tagId }
  formatTimerange(timerange, params)
  return request({
    url: 'workflow/statisticsbystatus',
    method: 'get',
    params
  })
}

// 认领
export function claimPipeline (ids, remark) {
  return request({
    url: 'workflow/claim',
    method: 'put',
    data: { ids, remark }
  })
}

// 指派
export function assignPipeline (ids, remark, assignTo) {
  return request({
    url: 'workflow/assign',
    method: 'put',
    data: { ids, remark, assignto: assignTo }
  })
}

// 处理完成
export function processedPipeline (ids, remark) {
  return request({
    url: 'workflow/processed',
    method: 'put',
    data: { ids, remark }
  })
}

// 重新激活
export function reactivePipeline (ids, remark) {
  return request({
    url: 'workflow/reactive',
    method: 'put',
    data: { ids, remark }
  })
}

// 关闭
export function closePipeline (ids, remark) {
  return request({
    url: 'workflow/close',
    method: 'put',
    data: { ids, remark }
  })
}
