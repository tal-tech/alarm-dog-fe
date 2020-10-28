import request from '@/utils/request'

export function templates (page = 1, pageSize = 20, search = null) {
  return request({
    url: 'alarmtemplate',
    method: 'get',
    params: { search, page, pageSize }
  })
}

export function showTemplate (id) {
  return request({
    url: 'alarmtemplate/show',
    method: 'get',
    params: { id }
  })
}

export function storeTemplate (data) {
  return request({
    url: 'alarmtemplate/store',
    method: 'post',
    data: data
  })
}

export function updateTemplate (data) {
  return request({
    url: 'alarmtemplate/update',
    method: 'put',
    data: data
  })
}

export function deleteTemplate (id) {
  return request({
    url: 'alarmtemplate',
    method: 'delete',
    params: { id }
  })
}

export function simpleTemplate (search = null, pageSize = 20) {
  return request({
    url: 'alarmtemplate/simple',
    method: 'get',
    params: { search, pageSize }
  })
}

// 默认模板
export function defaultTemplates () {
  return request({
    url: 'alarmtemplate/defaults',
    method: 'get'
  })
}
