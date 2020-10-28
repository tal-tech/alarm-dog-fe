import request from '@/utils/request'

export function groups (page = 1, pageSize = 20, search = null) {
  return request({
    url: 'alarmgroup',
    method: 'get',
    params: { search, page, pageSize }
  })
}

export function showGroup (id) {
  return request({
    url: 'alarmgroup/show',
    method: 'get',
    params: { id }
  })
}

export function storeGroup (data) {
  return request({
    url: 'alarmgroup/store',
    method: 'post',
    data: data
  })
}

export function updateGroup (data) {
  return request({
    url: 'alarmgroup/update',
    method: 'put',
    data: data
  })
}

export function deleteGroup (id) {
  return request({
    url: 'alarmgroup/delete',
    method: 'delete',
    params: { id }
  })
}

export function groupSearch (search, pageSize = 20) {
  return request({
    url: 'alarmgroup/search',
    method: 'get',
    params: { search, pageSize }
  })
}
