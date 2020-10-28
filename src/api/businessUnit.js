import request from '@/utils/request'

export function businessUnits (page = 1, pageSize = 20, search = null) {
  return request({
    url: 'businessunit',
    method: 'get',
    params: { search, page, pageSize }
  })
}

export function simpleBusinessUnits () {
  return request({
    url: 'businessunit/simple',
    method: 'get'
  })
}

export function storeBusinessUnit (data) {
  return request({
    url: 'businessunit/store',
    method: 'post',
    data: data
  })
}

export function updateBusinessUnit (data) {
  return request({
    url: 'businessunit/update',
    method: 'put',
    data: data
  })
}

export function deleteBusinessUnit (id) {
  return request({
    url: 'businessunit',
    method: 'delete',
    params: { id }
  })
}

export function showBusinessUnit (id) {
  return request({
    url: 'businessunit/show',
    method: 'get',
    params: { id }
  })
}
