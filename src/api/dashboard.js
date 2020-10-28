import request from '@/utils/request'

export function stat (departmentId = null, tagId = null, taskId = null, date = null) {
  return request({
    url: 'dashboard/stat',
    method: 'get',
    params: { department_id: departmentId, tag_id: tagId, task_id: taskId, date }
  })
}

export function avgReqQps (departmentId = null, tagId = null, taskId = null, date = null) {
  return request({
    url: 'dashboard/avgreqqps',
    method: 'get',
    params: { department_id: departmentId, tag_id: tagId, task_id: taskId, date }
  })
}

export function maxReqQps (departmentId = null, tagId = null, taskId = null, date = null) {
  return request({
    url: 'dashboard/maxreqqps',
    method: 'get',
    params: { department_id: departmentId, tag_id: tagId, task_id: taskId, date }
  })
}

export function avgProdQps (departmentId = null, tagId = null, taskId = null, date = null) {
  return request({
    url: 'dashboard/avgprodqps',
    method: 'get',
    params: { department_id: departmentId, tag_id: tagId, task_id: taskId, date }
  })
}

export function maxProdQps (departmentId = null, tagId = null, taskId = null, date = null) {
  return request({
    url: 'dashboard/maxprodqps',
    method: 'get',
    params: { department_id: departmentId, tag_id: tagId, task_id: taskId, date }
  })
}
