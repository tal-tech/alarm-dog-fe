import request from '@/utils/request'

export function datasources (page = 1, pageSize = 20, search = null, order = { id: 'asc' }) {
  return request({
    url: 'monitor/datasource',
    method: 'get',
    params: { search, page, pageSize, order }
  })
}

export function showDatasource (id) {
  return request({
    url: 'monitor/datasource/show',
    method: 'get',
    params: { id }
  })
}

export function storeDatasource (data) {
  return request({
    url: 'monitor/datasource/store',
    method: 'post',
    data: data
  })
}

export function updateDatasource (data) {
  return request({
    url: 'monitor/datasource/update',
    method: 'put',
    data: data
  })
}

export function deleteDatasource (id) {
  return request({
    url: 'monitor/datasource',
    method: 'delete',
    params: { id }
  })
}

export function simpleDatasources (search = null, pageSize = 20) {
  return request({
    url: 'monitor/datasource/simple',
    method: 'get',
    params: { search, pageSize }
  })
}

// 验证数据源是否合法
export function validConnect (data) {
  return request({
    url: 'monitor/datasource/validconnect',
    method: 'post',
    data
  })
}

// 数据源字段
export function getFields (id) {
  return request({
    url: 'monitor/datasource/fields',
    method: 'get',
    params: { id }
  })
}
