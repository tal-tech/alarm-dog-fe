import request from '@/utils/request'

export function departments (page = 1, pageSize = 20, search = null, buId = null) {
  return request({
    url: 'department',
    method: 'get',
    params: { search, page, pageSize, bu_id: buId }
  })
}

export function simpleDepartments (pageSize = 20, search = null, buId = null) {
  return request({
    url: 'department/simple',
    method: 'get',
    params: { search, pageSize, bu_id: buId }
  })
}

export function storeDepartment (data) {
  return request({
    url: 'department/store',
    method: 'post',
    data: data
  })
}

export function updateDepartment (data) {
  return request({
    url: 'department/update',
    method: 'put',
    data: data
  })
}

export function deleteDepartment (id) {
  return request({
    url: 'department',
    method: 'delete',
    params: { id }
  })
}

export function showDepartment (id) {
  return request({
    url: 'department/show',
    method: 'get',
    params: { id }
  })
}
